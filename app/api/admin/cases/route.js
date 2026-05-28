/* /api/admin/cases — справи Понаглення.
   GET:  список справ (фiльтр за stage, status, worker_id).
   POST: створити нову справу. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const stage    = searchParams.get("stage")     || "";
  const status   = searchParams.get("status")    || "active";
  const workerId = parseInt(searchParams.get("worker_id") || "0") || 0;

  const rows = await q(
    `SELECT
       c.id, c.lead_id, c.full_name, c.contact, c.case_number,
       c.submission_date, c.urzad, c.stage, c.status,
       c.has_dodatek_1, c.has_zus_cert,
       c.ponaglenie_sent_at, c.deadline_date, c.alert_sent,
       c.notes, c.created_at, c.updated_at, c.assigned_to,
       u.full_name AS worker_name,
       CASE WHEN c.deadline_date IS NOT NULL
            THEN (c.deadline_date - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM cases c
     LEFT JOIN kompas_users u ON u.id = c.assigned_to
     WHERE ($1 = '' OR c.status = $1)
       AND ($2 = '' OR c.stage  = $2)
       AND ($3 = 0   OR c.assigned_to = $3)
     ORDER BY
       CASE WHEN c.deadline_date IS NOT NULL
            THEN (c.deadline_date - CURRENT_DATE)::int
            ELSE 9999
       END ASC,
       c.created_at DESC
     LIMIT 200`,
    [status, stage, workerId]
  );
  return NextResponse.json({ cases: rows });
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (!b.full_name) {
    return NextResponse.json({ error: "Потрiбне ПIБ клiєнта" }, { status: 400 });
  }

  const row = await one(
    `INSERT INTO cases
       (lead_id, full_name, contact, case_number, submission_date, urzad,
        deadline_date, notes, assigned_to)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      b.lead_id         || null,
      b.full_name,
      b.contact         || null,
      b.case_number     || null,
      b.submission_date || null,
      b.urzad           || null,
      b.deadline_date   || null,
      b.notes           || null,
      b.assigned_to     || null,
    ]
  );

  await q(
    `INSERT INTO case_logs (case_id, event, actor)
     VALUES ($1, 'Справу створено', 'manager')`,
    [row.id]
  );

  return NextResponse.json({ case: row }, { status: 201 });
}
