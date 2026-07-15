import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const [totalLeadsRow] = await q(`SELECT COUNT(*)::int AS n FROM leads`);
    const [activeLeadsRow] = await q(
      `SELECT COUNT(*)::int AS n FROM leads WHERE COALESCE(status, 'new') NOT IN ('won', 'lost')`
    );
    const [wonLeadsRow] = await q(
      `SELECT COUNT(*)::int AS n FROM leads WHERE status = 'won'`
    );
    const [monthRevenueRow] = await q(
      `SELECT COALESCE(SUM(total_price), 0)::numeric AS total FROM orders
       WHERE status = 'выполнено' AND date_trunc('month', created_at) = date_trunc('month', NOW())`
    );
    const [prevMonthRevenueRow] = await q(
      `SELECT COALESCE(SUM(total_price), 0)::numeric AS total FROM orders
       WHERE status = 'выполнено' AND date_trunc('month', created_at) = date_trunc('month', NOW() - INTERVAL '1 month')`
    );
    const [incomeLogRow] = await q(
      `SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM custom_payments
       WHERE type = 'income' AND date_trunc('month', created_at) = date_trunc('month', NOW())`
    );

    const sourceRows = await q(
      `SELECT COALESCE(source, 'інше') AS source, COUNT(*)::int AS n
       FROM leads
       GROUP BY COALESCE(source, 'інше')
       ORDER BY n DESC
       LIMIT 8`
    );
    const totalLeads = totalLeadsRow?.n || 0;
    const bySource = sourceRows.map((r) => ({
      source: r.source,
      count: r.n,
      pct: totalLeads > 0 ? Math.round((r.n / totalLeads) * 100) : 0,
    }));

    const totalRevenue = Number(monthRevenueRow?.total || 0) + Number(incomeLogRow?.total || 0);
    const prevRevenue = Number(prevMonthRevenueRow?.total || 0);
    const revenueDelta = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : null;

    const conversionRate = totalLeads > 0 ? Math.round(((wonLeadsRow?.n || 0) / totalLeads) * 100) : 0;

    return NextResponse.json({
      data: {
        totalRevenue,
        revenueDelta,
        activeLeads: activeLeadsRow?.n || 0,
        totalLeads,
        conversionRate,
        wonLeads: wonLeadsRow?.n || 0,
        bySource,
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
