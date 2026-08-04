export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const CASE_TYPES = ["odwolanie_decyzja", "skarga_wsa", "skarga_kasacyjna_nsa", "wstrzymanie_wykonania", "inne"];
const STAGES = ["preparation", "filed", "hearing_scheduled", "in_court", "resolved"];

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const stage    = searchParams.get("stage")     || "";
  const workerId = parseInt(searchParams.get("worker_id") || "0") || 0;
  const statusParam = searchParams.get("status");
  const status      = statusParam === null ? "active" : statusParam;

  const rows = await q(
    `SELECT
       c.id, c.lead_id, c.full_name, c.contact, c.case_type, c.court_name,
       c.case_signature, c.opposing_decision_ref, c.stage, c.status,
       c.filed_date, c.hearing_date, c.deadline_date, c.notes,
       c.created_at, c.updated_at, c.assigned_to,
       u.full_name AS worker_name,
       CASE WHEN c.deadline_date IS NOT NULL
            THEN (c.deadline_date - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM litigation_cases c
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
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (!b.full_name) {
    return NextResponse.json({ error: "Потрiбне ПIБ клiєнта" }, { status: 400 });
  }
  if (b.case_type && !CASE_TYPES.includes(b.case_type)) {
    return NextResponse.json({ error: "Некоректний тип справи" }, { status: 400 });
  }
  if (b.stage && !STAGES.includes(b.stage)) {
    return NextResponse.json({ error: "Некоректний етап" }, { status: 400 });
  }

  const row = await one(
    `INSERT INTO litigation_cases
       (lead_id, full_name, contact, case_type, court_name, case_signature,
        opposing_decision_ref, filed_date, hearing_date, deadline_date, notes, assigned_to)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      b.lead_id              || null,
      b.full_name,
      b.contact              || null,
      b.case_type            || "odwolanie_decyzja",
      b.court_name           || null,
      b.case_signature       || null,
      b.opposing_decision_ref|| null,
      b.filed_date           || null,
      b.hearing_date         || null,
      b.deadline_date        || null,
      b.notes                || null,
      b.assigned_to          || null,
    ]
  );

  await q(
    `INSERT INTO litigation_case_logs (case_id, event, actor)
     VALUES ($1, 'Судову справу створено', $2)`,
    [row.id, auth.user?.full_name || 'manager']
  );

  return NextResponse.json({ case: row }, { status: 201 });
}
