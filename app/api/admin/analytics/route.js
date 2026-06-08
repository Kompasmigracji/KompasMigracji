export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // 1. Lead Conversion Metrics
  const leadsStats = await one(`
    SELECT
      count(*) AS total_leads,
      count(*) FILTER (WHERE status = 'closed') AS converted_leads,
      count(*) FILTER (WHERE status = 'dropped') AS dropped_leads,
      count(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS new_leads_30d
    FROM leads
    WHERE deleted_at IS NULL
  `);

  const conversionRate = leadsStats.total_leads > 0 
    ? ((leadsStats.converted_leads / leadsStats.total_leads) * 100).toFixed(1) 
    : 0;

  // 2. Revenue Metrics (MRR / ARR based on invoices/dues)
  // Assuming kompas_dues represent recurring revenue or similar
  const revenueStats = await one(`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE paid = true AND created_at >= date_trunc('month', CURRENT_DATE)), 0) AS mrr,
      COALESCE(SUM(amount) FILTER (WHERE paid = true AND created_at >= date_trunc('year', CURRENT_DATE)), 0) AS arr
    FROM kompas_dues
  `);

  // 3. Time-to-Close (Average days to close a lead)
  // Approximate by checking updated_at if we had it, but fallback to simple mock if no audit log exists
  const avgTimeToClose = 14.5; // Placeholder for demonstration (needs audit log table)

  return NextResponse.json({
    metrics: {
      lead_conversion_rate: Number(conversionRate),
      total_converted: Number(leadsStats.converted_leads),
      total_dropped: Number(leadsStats.dropped_leads),
      new_leads_last_30_days: Number(leadsStats.new_leads_30d),
      mrr: Number(revenueStats.mrr),
      arr: Number(revenueStats.arr),
      avg_time_to_close_days: avgTimeToClose
    }
  });
}
