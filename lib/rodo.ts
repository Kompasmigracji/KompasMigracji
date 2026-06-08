/* lib/rodo.ts — GDPR/RODO Compliance Services for KompasCRM.
   Handles recording user consents and executing "Right to be Forgotten" erasures. */

import { q, one } from "./db.js";

interface ConsentOptions {
  userId?: number | null;
  email?: string | null;
  phone?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Log a GDPR consent action (give, withdraw, delete request) to the audit log.
 */
export async function logRodoConsent(
  actionType: "give_consent" | "withdraw_consent" | "request_deletion",
  options: ConsentOptions
) {
  const { userId, email, phone, ipAddress, userAgent } = options;

  await q(
    `INSERT INTO kompas_rodo_consent_logs (user_id, email, phone, action_type, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId || null,
      email || null,
      phone || null,
      actionType,
      ipAddress || null,
      userAgent || null,
    ]
  );

  // If user_id is provided and they gave consent, update their member profile
  if (userId && actionType === "give_consent") {
    await q(
      `UPDATE kompas_member_profiles
          SET rodo_consented_at = NOW(),
              rodo_consent_source = 'crm_system',
              rodo_consent_version = 'v1.0'
        WHERE user_id = $1`,
      [userId]
    );
  }
}

/**
 * Purge all personally identifiable information (PII) for a user to comply with
 * RODO "Right to be Forgotten", while retaining anonymized transaction totals for tax law.
 */
export async function purgeUserData(userId: number, requestIp?: string, requestUserAgent?: string) {
  // 1. Log the deletion action before clearing identifying information
  const user = (await one(
    `SELECT email, phone, full_name FROM kompas_users WHERE id = $1`,
    [userId]
  )) as { email: string; phone?: string; full_name: string } | null;

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  await logRodoConsent("request_deletion", {
    userId,
    email: user.email,
    phone: user.phone || null,
    ipAddress: requestIp,
    userAgent: requestUserAgent,
  });

  // 2. Anonymize user records in kompas_users
  const dummyEmail = `deleted_user_${userId}_${Date.now()}@kompasmigracji.com`;
  await q(
    `UPDATE kompas_users
        SET full_name = 'Deleted User',
            email = $1,
            phone = NULL,
            password_hash = 'PURGED_GDPR',
            status = 'deleted'
      WHERE id = $2`,
    [dummyEmail, userId]
  );

  // 3. Clear notes in member profile
  await q(
    `UPDATE kompas_member_profiles
        SET notes = 'Profile purged on request (RODO)',
            dues_status = 'purged'
      WHERE user_id = $1`,
    [userId]
  );

  // 4. Anonymize corresponding leads (if lead matches user email or phone)
  const userLeads = (await q(
    `SELECT id FROM leads WHERE (email = $1 OR phone = $2) AND deleted_at IS NULL`,
    [user.email, user.phone || "---"]
  )) as Array<{ id: string }>;

  for (const lead of userLeads) {
    await q(
      `UPDATE leads
          SET name = 'Purged Client',
              first_name = 'Purged',
              username = 'purged_rodo',
              phone = NULL,
              email = NULL,
              situation = 'Purged according to RODO request.',
              message = 'Purged.',
              qualification = NULL,
              deleted_at = NOW(),
              status = 'closed'
        WHERE id = $1`,
      [lead.id]
    );
  }

  console.log(`[rodo] Successfully purged PII for user ID ${userId}`);
}
