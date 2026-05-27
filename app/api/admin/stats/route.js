/* GET /api/admin/stats — агрегаты для дашборда KompasCRM.
   Читает компас-таблицы (members, cases, dues) + существующую таблицу leads. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // Участники профсоюза (компас-таблица)
  const members = await one(`
    SELECT
      count(*)                                   AS total,
      count(*) FILTER (WHERE status = 'active')  AS active,
      count(*) FILTER (WHERE status = 'pending') AS pending
    FROM kompas_users WHERE role = 'member'`);

  // Лиды (из существующей таблицы leads проекта)
  const leads = await one(`
    SELECT
      count(*)                                            AS total,
      count(*) FILTER (WHERE COALESCE(status,'new')='new')  AS new,
      count(*) FILTER (WHERE status = 'closed')           AS converted
    FROM leads`);

  // Юридические дела (компас-таблица)
  const cases = await one(`
    SELECT
      count(*) FILTER (WHERE status IN ('open','in_progress')) AS active,
      count(*) FILTER (WHERE status = 'resolved')              AS resolved
    FROM kompas_cases`);

  // Взносы (компас-таблица)
  const dues = await one(`
    SELECT
      coalesce(sum(amount) FILTER (WHERE paid = true),  0) AS collected,
      coalesce(sum(amount) FILTER (WHERE paid = false), 0) AS outstanding
    FROM kompas_dues`);

  // Динамика регистраций участников за 14 дней
  const series = await q(`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, coalesce(c.cnt, 0) AS cnt
    FROM generate_series(current_date - 13, current_date, '1 day') d
    LEFT JOIN (
      SELECT date_trunc('day', created_at)::date dd, count(*) cnt
      FROM kompas_users WHERE role = 'member'
      GROUP BY 1
    ) c ON c.dd = d
    ORDER BY d`);

  // Лиды по источникам (bot = из Telegram, site = с сайта)
  const bySource = await q(`
    SELECT
      CASE WHEN chat_id IS NOT NULL THEN 'bot' ELSE 'site' END AS source,
      count(*) AS cnt
    FROM leads
    GROUP BY 1
    ORDER BY cnt DESC`);

  // Последние 6 лидов для дашборда
  const recentLeads = await q(`
    SELECT
      id,
      CASE WHEN chat_id IS NOT NULL THEN 'bot' ELSE 'site' END AS source,
      first_name   AS name,
      COALESCE(status, 'new')     AS status,
      created_at
    FROM leads ORDER BY created_at DESC LIMIT 6`);

  return NextResponse.json({
    members: {
      total: Number(members?.total || 0),
      active: Number(members?.active || 0),
      pending: Number(members?.pending || 0),
    },
    leads: {
      total: Number(leads?.total || 0),
      new: Number(leads?.new || 0),
      converted: Number(leads?.converted || 0),
    },
    cases: {
      active: Number(cases?.active || 0),
      resolved: Number(cases?.resolved || 0),
    },
    duesCollected: Number(dues?.collected || 0),
    duesOutstanding: Number(dues?.outstanding || 0),
    series: series.map((r) => Number(r.cnt)),
    leadsBySource: bySource.map((r) => ({ source: r.source, count: Number(r.cnt) })),
    recentLeads,
  });
}
