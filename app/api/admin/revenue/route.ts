/* Innovation 1: Revenue Analytics API
   F1: MRR auto-calculation (active_members × avg_due)
   F2: ARR = MRR × 12
   F3: Churn risk — members з dues_status=unpaid > 45 days */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const [members, dues, leadsStats, snapshots, topMonths] = await Promise.all([
    // Active member count
    one(`SELECT
      count(*) FILTER (WHERE status='active') AS active,
      count(*) FILTER (WHERE status='pending') AS pending,
      count(*) AS total
      FROM kompas_users WHERE role='member'`),

    // Dues summary
    one(`SELECT
      coalesce(sum(amount) FILTER (WHERE paid=true), 0)  AS collected,
      coalesce(sum(amount) FILTER (WHERE paid=false), 0) AS outstanding,
      coalesce(avg(amount) FILTER (WHERE paid=true), 0)  AS avg_due,
      count(DISTINCT user_id) FILTER (WHERE paid=true)   AS payers
      FROM kompas_dues`),

    // Lead conversion
    one(`SELECT
      count(*) AS total,
      count(*) FILTER (WHERE status='closed') AS converted,
      count(*) FILTER (WHERE paid_at IS NOT NULL) AS paid
      FROM leads WHERE deleted_at IS NULL`),

    // Last 30 days snapshots for chart
    q(`SELECT date, mrr, members_active, leads_new, leads_converted, churn_risk
       FROM kompas_revenue_snapshots
       ORDER BY date DESC LIMIT 30`),

    // Top revenue months
    q(`SELECT to_char(period, 'YYYY-MM') AS month,
              sum(amount) AS revenue,
              count(*) FILTER (WHERE paid=true) AS paid_count
       FROM kompas_dues
       WHERE paid=true
       GROUP BY 1 ORDER BY 1 DESC LIMIT 6`),
  ]);

  const activeMembers = Number(members?.active || 0);
  const avgDue = Number(dues?.avg_due || 0);
  const mrr = Math.round(activeMembers * avgDue * 100) / 100;
  const arr = Math.round(mrr * 12 * 100) / 100;

  // F3: Churn risk — members who have unpaid dues
  const churnRisk = await one(`
    SELECT count(DISTINCT mp.user_id) AS cnt
    FROM kompas_member_profiles mp
    JOIN kompas_users u ON u.id = mp.user_id
    WHERE mp.dues_status = 'unpaid'
      AND u.status = 'active'
      AND u.created_at < now() - interval '45 days'`);

  const totalLeads = Number(leadsStats?.total || 0);
  const convRate = totalLeads > 0
    ? Math.round((Number(leadsStats?.converted || 0) / totalLeads) * 100)
    : 0;

  return NextResponse.json({
    mrr,
    arr,
    activeMembers,
    avgDue: Math.round(avgDue * 100) / 100,
    duesCollected: Number(dues?.collected || 0),
    duesOutstanding: Number(dues?.outstanding || 0),
    payers: Number(dues?.payers || 0),
    leadsTotal: totalLeads,
    leadsConverted: Number(leadsStats?.converted || 0),
    leadsPaid: Number(leadsStats?.paid || 0),
    convRate,
    churnRisk: Number(churnRisk?.cnt || 0),
    snapshots: snapshots.map((s: any) => ({
      date: s.date,
      mrr: Number(s.mrr),
      members: Number(s.members_active),
      leadsNew: Number(s.leads_new),
      leadsConverted: Number(s.leads_converted),
      churnRisk: Number(s.churn_risk),
    })),
    topMonths: topMonths.map((m: any) => ({
      month: m.month,
      revenue: Number(m.revenue),
      paidCount: Number(m.paid_count),
    })),
  });
}
