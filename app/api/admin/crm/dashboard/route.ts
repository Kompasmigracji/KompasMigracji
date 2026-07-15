import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const STATUS_LABEL: Record<string, string> = {
  new: 'Нові',
  contacted: 'Взяті в роботу',
  pending: 'Думають',
  won: 'Успіх',
  lost: 'Відмова',
};

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const [leadsCountRow] = await q(`SELECT COUNT(*)::int AS n FROM leads`);
    const [activeOrdersRow] = await q(
      `SELECT COUNT(*)::int AS n FROM orders WHERE status NOT IN ('выполнено', 'отменено')`
    );
    const [successOrdersRow] = await q(
      `SELECT COUNT(*)::int AS n FROM orders WHERE status = 'выполнено'`
    );
    const [revenueRow] = await q(
      `SELECT COALESCE(SUM(total_price), 0)::numeric AS total FROM orders WHERE status = 'выполнено'`
    );

    const statusRows = await q(
      `SELECT COALESCE(status, 'new') AS status, COUNT(*)::int AS n
       FROM leads
       GROUP BY COALESCE(status, 'new')
       ORDER BY n DESC`
    );
    const totalLeads = leadsCountRow?.n || 0;
    const statusBreakdown = statusRows.map((r: any) => ({
      status: r.status,
      label: STATUS_LABEL[r.status] || r.status,
      count: r.n,
      pct: totalLeads > 0 ? Math.round((r.n / totalLeads) * 100) : 0,
    }));

    const monthlyRows = await q(
      `SELECT to_char(date_trunc('month', created_at), 'Mon') AS name,
              COUNT(*)::int AS leads
       FROM leads
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY date_trunc('month', created_at)
       ORDER BY date_trunc('month', created_at) ASC`
    );
    const monthlyRevenueRows = await q(
      `SELECT to_char(date_trunc('month', created_at), 'Mon') AS name,
              COALESCE(SUM(total_price), 0)::numeric AS revenue
       FROM orders
       WHERE status = 'выполнено' AND created_at >= NOW() - INTERVAL '6 months'
       GROUP BY date_trunc('month', created_at)
       ORDER BY date_trunc('month', created_at) ASC`
    );
    const revenueByMonth: Record<string, number> = {};
    monthlyRevenueRows.forEach((r: any) => { revenueByMonth[r.name] = Number(r.revenue); });
    const chartData = monthlyRows.map((r: any) => ({
      name: r.name,
      leads: r.leads,
      revenue: revenueByMonth[r.name] || 0,
    }));

    return NextResponse.json({
      data: {
        metrics: {
          newLeads: totalLeads,
          activeOrders: activeOrdersRow?.n || 0,
          successfulDeals: successOrdersRow?.n || 0,
          revenue: Number(revenueRow?.total) || 0,
        },
        chartData: chartData.length > 0 ? chartData : [{ name: '—', leads: 0, revenue: 0 }],
        statusBreakdown,
      }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
