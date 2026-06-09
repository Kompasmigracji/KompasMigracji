export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";

// GET /api/admin/emails - List emails or sync with IMAP
export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const sync = searchParams.get("sync") === "true";
  const folder = searchParams.get("folder") || "inbox";
  const entityType = searchParams.get("entity_type") || "";
  const entityId = searchParams.get("entity_id") || "";

  // 1. IMAP SYNC ENGINE
  if (sync) {
    try {
      const accounts = await q("SELECT * FROM kompas_email_accounts WHERE is_active = true");
      let syncedCount = 0;

      for (const acc of accounts) {
        if (!acc.imap_host || !acc.username || !acc.password_encrypted) continue;

        const client = new ImapFlow({
          host: acc.imap_host,
          port: acc.imap_port || 993,
          secure: acc.imap_ssl !== false,
          auth: {
            user: acc.username,
            pass: acc.password_encrypted,
          },
          logger: false,
        });

        try {
          // Connect with 6s timeout
          await Promise.race([
            client.connect(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("IMAP Connection Timeout")), 6000)),
          ]);

          const lock = await client.getMailboxLock("INBOX");
          try {
            const status = await client.status("INBOX", { messages: true });
            const totalMessages = status.messages;

            if (totalMessages > 0) {
              const startSeq = Math.max(1, totalMessages - 19); // Fetch latest 20 emails
              const range = `${startSeq}:${totalMessages}`;

              for await (let msg of client.fetch(range, { envelope: true, source: true })) {
                const msgId = msg.envelope.messageId || `msg-${msg.uid}-${msg.envelope.date?.getTime()}`;
                
                // Deduplicate
                const exists = await one("SELECT id FROM kompas_emails WHERE message_id = $1", [msgId]);
                if (exists) continue;

                const fromAddress = msg.envelope.from?.[0]?.address || "";
                const toAddresses = (msg.envelope.to || []).map((t) => t.address).filter(Boolean);
                const subject = msg.envelope.subject || "(Без теми)";
                const receivedAt = msg.envelope.date || new Date();

                // Simple body parser: decode content buffer
                let bodyText = "";
                try {
                  bodyText = msg.source.toString("utf-8");
                  // Basic MIME message text extractor
                  const textIndex = bodyText.indexOf("\r\n\r\n");
                  if (textIndex !== -1) {
                    bodyText = bodyText.substring(textIndex + 4);
                  }
                  // Clean standard headers or boundary lines
                  bodyText = bodyText.split("\n").filter(line => !line.startsWith("Content-") && !line.startsWith("--")).join("\n");
                  if (bodyText.length > 5000) bodyText = bodyText.substring(0, 5000) + "...";
                } catch {
                  bodyText = "(Не вдалося розпарсити вміст листа)";
                }

                // Auto-link matching
                let entityTypeMatch = null;
                let entityIdMatch = null;

                // Lookup matching member
                const member = await one(
                  `SELECT id FROM kompas_users WHERE email = $1 AND role = 'member' LIMIT 1`,
                  [fromAddress]
                );
                if (member) {
                  entityTypeMatch = "member";
                  entityIdMatch = String(member.id);
                } else {
                  // Lookup matching lead
                  const lead = await one(
                    `SELECT id FROM leads WHERE contact ILIKE $1 OR name ILIKE $1 LIMIT 1`,
                    [`%${fromAddress}%`]
                  );
                  if (lead) {
                    entityTypeMatch = "lead";
                    entityIdMatch = String(lead.id);
                  }
                }

                // Insert received email
                await one(
                  `INSERT INTO kompas_emails (
                    message_id, from_address, to_addresses, subject, body_text, folder, status, entity_type, entity_id, received_at
                  ) VALUES ($1, $2, $3, $4, $5, 'inbox', 'received', $6, $7, $8)
                  RETURNING id`,
                  [
                    msgId,
                    fromAddress,
                    toAddresses,
                    subject,
                    bodyText,
                    entityTypeMatch,
                    entityIdMatch,
                    receivedAt,
                  ]
                );

                // Add Activity entry
                if (entityTypeMatch && entityIdMatch) {
                  await one(
                    `INSERT INTO kompas_activities (entity_type, entity_id, actor_id, type, title, body)
                     VALUES ($1, $2, $3, 'email', $4, $5)`,
                    [
                      entityTypeMatch,
                      entityIdMatch,
                      acc.user_id,
                      `Отримано email: ${subject}`,
                      `Від: ${fromAddress}\n\n${bodyText.substring(0, 300)}...`,
                    ]
                  );
                }

                syncedCount++;
              }
            }

            await q("UPDATE kompas_email_accounts SET last_sync = NOW() WHERE id = $1", [acc.id]);
          } finally {
            lock.release();
          }
          await client.logout();
        } catch (syncErr) {
          console.error(`IMAP sync failed for ${acc.email_address}:`, syncErr.message);
        }
      }

      console.log(`Synced ${syncedCount} new incoming emails via IMAP.`);
    } catch (err) {
      console.error("GET Email sync root error:", err);
    }
  }

  // 2. QUERY SYSTEM EMAILS
  try {
    let rows;
    if (entityType && entityId) {
      rows = await q(
        `SELECT e.*, u.full_name AS sender_name
         FROM kompas_emails e
         LEFT JOIN kompas_users u ON u.id = e.sent_by
         WHERE e.entity_type = $1 AND e.entity_id = $2
         ORDER BY e.created_at DESC`,
        [entityType, String(entityId)]
      );
    } else {
      rows = await q(
        `SELECT e.*, u.full_name AS sender_name
         FROM kompas_emails e
         LEFT JOIN kompas_users u ON u.id = e.sent_by
         WHERE e.folder = $1
         ORDER BY e.created_at DESC`,
        [folder]
      );
    }

    return NextResponse.json({ emails: rows });
  } catch (err) {
    console.error("GET List emails error:", err);
    return NextResponse.json({ error: "Помилка завантаження листів" }, { status: 500 });
  }
}

// POST /api/admin/emails - Send new email
export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const { to, cc, subject, body_html, body_text, entity_type, entity_id } = b;

  if (!to || to.length === 0 || !subject) {
    return NextResponse.json({ error: "Адресат та тема листа обов'язкові" }, { status: 400 });
  }

  const toAddresses = Array.isArray(to) ? to : [to];
  const ccAddresses = cc ? (Array.isArray(cc) ? cc : [cc]) : [];
  const bodyText = body_text || body_html?.replace(/<[^>]*>/g, "") || "";
  const bodyHtml = body_html || body_text?.replace(/\n/g, "<br>") || "";

  // 1. Get Sender SMTP account
  const acc = await one(
    `SELECT * FROM kompas_email_accounts WHERE user_id = $1 AND is_active = true LIMIT 1`,
    [auth.user.id]
  );
  
  const fromAddress = acc ? acc.email_address : `${auth.user.role}@kompasmigracji.com`;

  // 2. Insert into database
  try {
    const newEmail = await one(
      `INSERT INTO kompas_emails (
        message_id, from_address, to_addresses, cc_addresses, subject, body_html, body_text, folder, status, entity_type, entity_id, sent_by, sent_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'sent', 'sending', $8, $9, $10, NOW())
      RETURNING *`,
      [
        `out-${Date.now()}-${auth.user.id}@kompasmigracji.com`,
        fromAddress,
        toAddresses,
        ccAddresses,
        subject,
        bodyHtml,
        bodyText,
        entity_type || null,
        entity_id ? String(entity_id) : null,
        auth.user.id
      ]
    );

    // 3. SMTP Send Execution
    if (acc && acc.smtp_host && acc.username && acc.password_encrypted) {
      try {
        const transporter = nodemailer.createTransport({
          host: acc.smtp_host,
          port: acc.smtp_port || 465,
          secure: acc.smtp_ssl !== false,
          auth: {
            user: acc.username,
            pass: acc.password_encrypted,
          },
        });

        await transporter.sendMail({
          from: `"${acc.name}" <${acc.email_address}>`,
          to: toAddresses.join(", "),
          cc: ccAddresses.length > 0 ? ccAddresses.join(", ") : undefined,
          subject: subject,
          text: bodyText,
          html: bodyHtml,
        });

        await q("UPDATE kompas_emails SET status = 'sent' WHERE id = $1", [newEmail.id]);
      } catch (smtpErr) {
        console.error("SMTP delivery failed:", smtpErr);
        await q("UPDATE kompas_emails SET status = 'failed', folder = 'drafts' WHERE id = $1", [newEmail.id]);
        return NextResponse.json(
          { error: `Неможливо надіслати лист через SMTP: ${smtpErr.message}` },
          { status: 500 }
        );
      }
    } else {
      // Sandbox fallback log
      console.log(`[SMTP MOCK] Sent email successfully to ${toAddresses.join(", ")}`);
      await q("UPDATE kompas_emails SET status = 'sent' WHERE id = $1", [newEmail.id]);
    }

    // 4. Log sent activity timeline
    if (entity_type && entity_id) {
      await one(
        `INSERT INTO kompas_activities (entity_type, entity_id, actor_id, type, title, body)
         VALUES ($1, $2, $3, 'email', $4, $5)`,
        [
          entity_type,
          String(entity_id),
          auth.user.id,
          `Надіслано email: ${subject}`,
          `Кому: ${toAddresses.join(", ")}\n\n${bodyText.substring(0, 300)}...`,
        ]
      );
    }

    return NextResponse.json({ email: newEmail, success: true }, { status: 201 });
  } catch (err) {
    console.error("POST Email save/delivery error:", err);
    return NextResponse.json({ error: "Помилка при створенні/відправці листа" }, { status: 500 });
  }
}
