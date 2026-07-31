import { q, one } from '@/lib/db';

/* Marks a `leads` row as paid and propagates the conversion to its linked
   `kompas_leads` row (the CRM funnel the admin UI actually reads) via the
   `kompas_lead_id` FK from migration 037 — not by email/value matching.

   Returns alreadyPaid so callers (P24/PayU/Stripe/mock webhook handlers)
   can skip re-sending "payment confirmed" Telegram/WhatsApp messages on a
   duplicate/replayed webhook delivery — Stripe's own docs say a webhook can
   be delivered more than once, and this endpoint has no other idempotency
   guard, so without this a replay just spams the customer and admin again. */
export async function markLeadPaid(leadId: string): Promise<{ alreadyPaid: boolean }> {
  const before = (await one(
    `SELECT paid_at FROM leads WHERE id = $1`,
    [leadId],
  )) as { paid_at: string | null } | null;

  if (before?.paid_at) {
    return { alreadyPaid: true };
  }

  const row = (await one(
    `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1 RETURNING kompas_lead_id`,
    [leadId],
  )) as { kompas_lead_id: number | null } | null;

  if (row?.kompas_lead_id) {
    await q(`UPDATE kompas_leads SET status = 'won' WHERE id = $1`, [row.kompas_lead_id]);
  }

  return { alreadyPaid: false };
}
