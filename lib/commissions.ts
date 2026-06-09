import { q, one } from "./db";

export async function calculateCommission(dueId: string, amountPaid: number, serviceSlug: string, leadId: string) {
  // Ensure tables exist
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS kompas_commission_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_slug TEXT NOT NULL,
        percentage NUMERIC NOT NULL,
        agent_id UUID
      )
    `);
    await q(`
      CREATE TABLE IF NOT EXISTS kompas_commissions_earned (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        due_id UUID NOT NULL,
        lead_id UUID NOT NULL,
        agent_id UUID,
        amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (err) {
    // ignore
  }

  // Get rule for this service
  const rule = await one(`
    SELECT percentage, agent_id 
    FROM kompas_commission_rules 
    WHERE service_slug = $1 
    LIMIT 1
  `, [serviceSlug]) as { percentage: number; agent_id: string } | null;

  if (rule) {
    const commissionAmount = (amountPaid * rule.percentage) / 100;

    await q(`
      INSERT INTO kompas_commissions_earned (due_id, lead_id, agent_id, amount)
      VALUES ($1, $2, $3, $4)
    `, [dueId, leadId, rule.agent_id, commissionAmount]);

    return commissionAmount;
  }

  return 0;
}
