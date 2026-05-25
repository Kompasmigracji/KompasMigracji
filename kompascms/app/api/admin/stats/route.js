/* GET /api/admin/stats — агрегаты для дашборда CMS. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const members = await one(`
    select
      count(*)                                   as total,
      count(*) filter (where status = 'active')  as active,
      count(*) filter (where status = 'pending') as pending
    from kompas_users where role = 'member'`);

  const leads = await one(`
    select
      count(*)                                       as total,
      count(*) filter (where status = 'new')         as new,
      count(*) filter (where status = 'converted')   as converted
    from kompas_leads`);

  const cases = await one(`
    select
      count(*) filter (where status in ('open','in_progress')) as active,
      count(*) filter (where status = 'resolved')              as resolved
    from kompas_cases`);

  const dues = await one(`
    select
      coalesce(sum(amount) filter (where paid = true), 0)  as collected,
      coalesce(sum(amount) filter (where paid = false), 0) as outstanding
    from kompas_dues`);

  // регистрации участников за 14 дней — для спарклайна
  const series = await q(`
    select to_char(d, 'YYYY-MM-DD') as day, coalesce(c.cnt, 0) as cnt
    from generate_series(current_date - 13, current_date, '1 day') d
    left join (
      select date_trunc('day', created_at)::date dd, count(*) cnt
      from kompas_users where role = 'member'
      group by 1
    ) c on c.dd = d
    order by d`);

  // распределение лидов по источникам — кастомная аналитика воронки
  const bySource = await q(`
    select source, count(*) as cnt
    from kompas_leads
    group by source
    order by cnt desc`);

  const recentLeads = await q(`
    select id, source, name, status, created_at
    from kompas_leads order by created_at desc limit 6`);

  return NextResponse.json({
    members: {
      total: Number(members.total),
      active: Number(members.active),
      pending: Number(members.pending),
    },
    leads: {
      total: Number(leads.total),
      new: Number(leads.new),
      converted: Number(leads.converted),
    },
    cases: { active: Number(cases.active), resolved: Number(cases.resolved) },
    duesCollected: Number(dues.collected),
    duesOutstanding: Number(dues.outstanding),
    series: series.map((r) => Number(r.cnt)),
    leadsBySource: bySource.map((r) => ({ source: r.source, count: Number(r.cnt) })),
    recentLeads,
  });
}
