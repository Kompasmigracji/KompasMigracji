export const dynamic = "force-dynamic";
﻿/* GET /api/admin/stats — агрегаты для дашборда KompasCRM.
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

  // Динамика регистраций лидов за 14 дней (виджет "Динаміка реєстрації лідів")
  const series = await q(`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, coalesce(c.cnt, 0) AS cnt
    FROM generate_series(current_date - 13, current_date, '1 day') d
    LEFT JOIN (
      SELECT date_trunc('day', created_at)::date dd, count(*) cnt
      FROM leads
      GROUP BY 1
    ) c ON c.dd = d
    ORDER BY d`);

  // Реальные тренды KPI: последние 7 дней против предыдущих 7.
  // null = нет базы для сравнения (бейдж тренда скрывается на фронте).
  const trendPct = (cur, prev) => {
    cur = Number(cur || 0); prev = Number(prev || 0);
    if (prev > 0) return Math.round(((cur - prev) / prev) * 100);
    return cur > 0 ? 100 : null;
  };
  let trends = { members: null, leads: null, cases: null, dues: null };
  try {
    const [mT, lT, cT, dT] = await Promise.all([
      one(`SELECT
             count(*) FILTER (WHERE created_at >= current_date - 6)                                    AS cur,
             count(*) FILTER (WHERE created_at >= current_date - 13 AND created_at < current_date - 6) AS prev
           FROM kompas_users WHERE role = 'member'`),
      one(`SELECT
             count(*) FILTER (WHERE created_at >= current_date - 6)                                    AS cur,
             count(*) FILTER (WHERE created_at >= current_date - 13 AND created_at < current_date - 6) AS prev
           FROM leads`),
      one(`SELECT
             count(*) FILTER (WHERE created_at >= current_date - 6)                                    AS cur,
             count(*) FILTER (WHERE created_at >= current_date - 13 AND created_at < current_date - 6) AS prev
           FROM kompas_cases`),
      one(`SELECT
             coalesce(sum(amount) FILTER (WHERE paid AND paid_at >= current_date - 6), 0)                                  AS cur,
             coalesce(sum(amount) FILTER (WHERE paid AND paid_at >= current_date - 13 AND paid_at < current_date - 6), 0) AS prev
           FROM kompas_dues`),
    ]);
    trends = {
      members: trendPct(mT?.cur, mT?.prev),
      leads: trendPct(lT?.cur, lT?.prev),
      cases: trendPct(cT?.cur, cT?.prev),
      dues: trendPct(dT?.cur, dT?.prev),
    };
  } catch (err) {
    console.error("[stats] trends failed:", err?.message);
  }

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

  // Угоды / Пайплайн (компас-таблица)
  const pipeline = await q(`
    SELECT
      stage,
      count(*) AS count,
      coalesce(sum(amount), 0) AS total_amount
    FROM kompas_deals
    GROUP BY stage`);

  // Предстоящие дедлайны по делам (SLA)
  const slaDeadlines = await q(`
    SELECT
      id,
      full_name,
      case_number,
      deadline_date,
      urzad,
      stage,
      status,
      CASE WHEN deadline_date IS NOT NULL
           THEN (deadline_date - CURRENT_DATE)::int
           ELSE NULL
      END AS days_left
    FROM cases
    WHERE status != 'closed' AND deadline_date IS NOT NULL
    ORDER BY deadline_date ASC
    LIMIT 8`);

  // Последние 10 активностей глобально
  const recentActivities = await q(`
    SELECT
      a.id,
      a.entity_type,
      a.entity_id,
      a.type,
      a.title,
      a.body,
      a.created_at,
      u.full_name AS actor_name
    FROM kompas_activities a
    LEFT JOIN kompas_users u ON u.id = a.actor_id
    ORDER BY a.created_at DESC
    LIMIT 10`);

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
    trends,
    series: series.map((r) => Number(r.cnt)),
    leadsBySource: bySource.map((r) => ({ source: r.source, count: Number(r.cnt) })),
    recentLeads,
    pipeline: pipeline.map((p) => ({
      stage: p.stage,
      count: Number(p.count),
      amount: Number(p.total_amount)
    })),
    slaDeadlines: slaDeadlines.map((s) => ({
      ...s,
      days_left: s.days_left !== null ? Number(s.days_left) : null
    })),
    recentActivities
  });
}

