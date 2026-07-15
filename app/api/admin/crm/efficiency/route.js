import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const rows = await q(`
      SELECT
        u.id,
        u.full_name,
        u.role,
        COALESCE(l.leads_count, 0)::int AS leads_count,
        COALESCE(d.deals_count, 0)::int AS deals_count,
        COALESCE(d.deals_won, 0)::int AS deals_won,
        COALESCE(d.value_won, 0)::numeric AS value_won,
        COALESCE(t.tasks_done, 0)::int AS tasks_done,
        COALESCE(t.tasks_total, 0)::int AS tasks_total
      FROM kompas_users u
      LEFT JOIN (
        SELECT auto_assigned_to, COUNT(*) AS leads_count
        FROM leads WHERE auto_assigned_to IS NOT NULL
        GROUP BY auto_assigned_to
      ) l ON l.auto_assigned_to = u.id
      LEFT JOIN (
        SELECT assigned_to,
               COUNT(*) AS deals_count,
               COUNT(*) FILTER (WHERE stage = 'closed_won') AS deals_won,
               COALESCE(SUM(amount) FILTER (WHERE stage = 'closed_won'), 0) AS value_won
        FROM kompas_deals WHERE assigned_to IS NOT NULL
        GROUP BY assigned_to
      ) d ON d.assigned_to = u.id
      LEFT JOIN (
        SELECT assigned_to,
               COUNT(*) FILTER (WHERE stage = 'done') AS tasks_done,
               COUNT(*) AS tasks_total
        FROM tasks WHERE assigned_to IS NOT NULL
        GROUP BY assigned_to
      ) t ON t.assigned_to = u.id
      WHERE u.role IN ('admin', 'moderator', 'manager', 'sales', 'lawyer')
      ORDER BY value_won DESC, leads_count DESC
    `);

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching efficiency stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
