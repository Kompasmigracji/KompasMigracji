export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
       p.id, p.lead_id, p.full_name, p.contact, p.permit_type,
       p.employer_name, p.employer_nip, p.voivodeship_office, p.application_number,
       p.stage, p.status, p.submitted_date, p.decision_deadline, p.notes,
       p.created_at, p.updated_at, p.assigned_to,
       u.full_name AS worker_name,
       CASE WHEN p.decision_deadline IS NOT NULL
            THEN (p.decision_deadline - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM work_permits p
     LEFT JOIN kompas_users u ON u.id = p.assigned_to
     WHERE ($1 = '' OR p.status = $1)
       AND ($2 = '' OR p.stage  = $2)
       AND ($3 = 0   OR p.assigned_to = $3)
     ORDER BY
       CASE WHEN p.decision_deadline IS NOT NULL
            THEN (p.decision_deadline - CURRENT_DATE)::int
            ELSE 9999
       END ASC,
       p.created_at DESC
     LIMIT 200`,
    [status, stage, workerId]
  );
  return NextResponse.json({ permits: rows });
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
  if (!b.permit_type) {
    return NextResponse.json({ error: "Потрiбен тип дозволу" }, { status: 400 });
  }

  const row = await one(
    `INSERT INTO work_permits
       (lead_id, full_name, contact, permit_type, employer_name, employer_nip,
        voivodeship_office, application_number, submitted_date, decision_deadline,
        notes, assigned_to)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      b.lead_id            || null,
      b.full_name,
      b.contact            || null,
      b.permit_type,
      b.employer_name      || null,
      b.employer_nip       || null,
      b.voivodeship_office || null,
      b.application_number || null,
      b.submitted_date     || null,
      b.decision_deadline  || null,
      b.notes              || null,
      b.assigned_to        || null,
    ]
  );

  await q(
    `INSERT INTO work_permit_logs (permit_id, event, actor)
     VALUES ($1, 'Заявку на дозвіл створено', $2)`,
    [row.id, auth.user?.full_name || 'manager']
  );

  return NextResponse.json({ permit: row }, { status: 201 });
}
