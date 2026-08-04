export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const CASE_TYPES = ["odwolanie_decyzja", "skarga_wsa", "skarga_kasacyjna_nsa", "wstrzymanie_wykonania", "inne"];
const STAGES = ["preparation", "filed", "hearing_scheduled", "in_court", "resolved"];

const STAGE_LABELS = {
  preparation:        "Підготовка скарги",
  filed:               "Подано до суду",
  hearing_scheduled:   "Призначено засідання",
  in_court:            "Судовий розгляд",
  resolved:            "Вирішено",
};

// Дозволені колонки для PATCH (запобігає SQL-ін'єкції через довільні ключі об'єкта)
const PATCHABLE_FIELDS = new Set([
  "lead_id", "full_name", "contact", "case_type", "court_name", "case_signature",
  "opposing_decision_ref", "stage", "status", "filed_date", "hearing_date",
  "deadline_date", "notes", "assigned_to",
]);

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const row = await one(
    `SELECT
       c.*,
       u.full_name AS worker_name,
       CASE WHEN c.deadline_date IS NOT NULL
            THEN (c.deadline_date - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM litigation_cases c
     LEFT JOIN kompas_users u ON u.id = c.assigned_to
     WHERE c.id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = await q(
    `SELECT * FROM litigation_case_logs WHERE case_id = $1 ORDER BY created_at DESC`,
    [id]
  );

  return NextResponse.json({ case: row, logs });
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (b.case_type && !CASE_TYPES.includes(b.case_type)) {
    return NextResponse.json({ error: "Некоректний тип справи" }, { status: 400 });
  }
  if (b.stage && !STAGES.includes(b.stage)) {
    return NextResponse.json({ error: "Некоректний етап" }, { status: 400 });
  }

  const keys = Object.keys(b).filter((k) => PATCHABLE_FIELDS.has(k));
  if (keys.length === 0) return NextResponse.json({ ok: true });

  const sets = [];
  const vals = [];
  let i = 1;
  for (const k of keys) {
    sets.push(`"${k}" = $${i}`);
    vals.push(b[k]);
    i++;
  }
  sets.push(`"updated_at" = now()`);
  vals.push(id);

  const sql = `UPDATE litigation_cases SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`;
  const row = await one(sql, vals);

  if (row) {
    let evt = `Оновлено: ${keys.join(", ")}`;
    if (keys.includes("stage")) {
      evt = `Етап змінено на: ${STAGE_LABELS[b.stage] || b.stage}`;
    }
    await q(
      `INSERT INTO litigation_case_logs (case_id, event, actor) VALUES ($1, $2, $3)`,
      [id, evt, auth.user?.full_name || 'System']
    );
  }

  return NextResponse.json({ case: row });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await q(`UPDATE litigation_cases SET status = 'closed', updated_at = now() WHERE id = $1`, [id]);
  await q(
    `INSERT INTO litigation_case_logs (case_id, event, actor) VALUES ($1, 'Справу закрито', $2)`,
    [id, auth.user?.full_name || 'System']
  );

  return NextResponse.json({ ok: true });
}
