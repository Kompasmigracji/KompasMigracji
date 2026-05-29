/* F1: Daily Revenue Snapshot — Vercel Cron triggers at 23:00 UTC daily
   Saves MRR, members, leads metrics to kompas_revenue_snapshots */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";

function verifyCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return auth === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const [members, dues, leads, churn] = await Promise.all([
    one(`SELECT
      count(*) FILTER (WHERE status='active') AS active,
      count(*) FILTER (WHERE created_at::date = current_date) AS new_today
      FROM kompas_users WHERE role='member'`),
    one(`SELECT coalesce(sum(amount) FILTER (WHERE paid=true), 0) AS collected,
              coalesce(avg(amount) FILTER (WHERE paid=true), 0)   AS avg_due
         FROM kompas_dues`),
    one(`SELECT
      count(*) FILTER (WHERE created_at::date = current_date) AS new_today,
      count(*) FILTER (WHERE status='closed' AND created_at::date = current_date) AS converted_today
      FROM leads WHERE deleted_at IS NULL`),
    one(`SELECT count(DISTINCT mp.user_id) AS cnt
         FROM kompas_member_profiles mp
         JOIN kompas_users u ON u.id = mp.user_id
         WHERE mp.dues_status='unpaid' AND u.status='active'
           AND u.created_at < now() - interval '45 days'`),
  ]);

  const activeMembers = Number(members?.active || 0);
  const avgDue = Number(dues?.avg_due || 0);
  const mrr = Math.round(activeMembers * avgDue * 100) / 100;
  const arr = Math.round(mrr * 12 * 100) / 100;

  await q(
    `INSERT INTO kompas_revenue_snapshots
       (date, mrr, arr, members_active, members_new, dues_collected,
        leads_new, leads_converted, churn_risk)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (date) DO UPDATE SET
       mrr=EXCLUDED.mrr, arr=EXCLUDED.arr,
       members_active=EXCLUDED.members_active,
       members_new=EXCLUDED.members_new,
       dues_collected=EXCLUDED.dues_collected,
       leads_new=EXCLUDED.leads_new,
       leads_converted=EXCLUDED.leads_converted,
       churn_risk=EXCLUDED.churn_risk`,
    [
      today, mrr, arr,
      activeMembers, Number(members?.new_today || 0),
      Number(dues?.collected || 0),
      Number(leads?.new_today || 0),
      Number(leads?.converted_today || 0),
      Number(churn?.cnt || 0),
    ],
  );

  return NextResponse.json({ ok: true, date: today, mrr, arr });
}
