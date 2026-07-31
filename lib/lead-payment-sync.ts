import { q, one } from '@/lib/db';

/* Marks a `leads` row as paid and propagates the conversion to its linked
   `kompas_leads` row (the CRM funnel the admin UI actually reads) via the
   `kompas_lead_id` FK from migration 037 — not by email/value matching. */
export async function markLeadPaid(leadId: string): Promise<void> {
  const row = (await one(
    `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1 RETURNING kompas_lead_id`,
    [leadId],
  )) as { kompas_lead_id: number | null } | null;

  if (row?.kompas_lead_id) {
    await q(`UPDATE kompas_leads SET status = 'won' WHERE id = $1`, [row.kompas_lead_id]);
  }
}
