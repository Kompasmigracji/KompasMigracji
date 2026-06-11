export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
     FROM enforcement_cases c
     LEFT JOIN kompas_users u ON u.id = c.assigned_to
     WHERE c.id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = await q(
    `SELECT * FROM enforcement_case_logs WHERE case_id = $1 ORDER BY created_at DESC`,
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

  const keys = Object.keys(b);
  if (keys.length === 0) return NextResponse.json({ ok: true });

  const sets = [];
  const vals = [];
  let i = 1;
  for (const k of keys) {
    sets.push(`"${k}" = $${i}`);
    vals.push(b[k]);
    i++;
  }
  vals.push(id);

  const sql = `UPDATE enforcement_cases SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`;
  const row = await one(sql, vals);

  if (row) {
    let evt = `Оновлено: ${keys.join(", ")}`;
    if (keys.includes("stage")) {
      const st = {
        "analysis": "Аналіз справи",
        "negotiation": "Переговори/Медіація",
        "execution": "У виконавця (Komornik)",
        "court": "Судовий етап"
      };
      evt = `Статус змінено на: ${st[b.stage] || b.stage}`;
    }
    await q(
      `INSERT INTO enforcement_case_logs (case_id, event, actor) VALUES ($1, $2, $3)`,
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

  await q(`UPDATE enforcement_cases SET status = 'closed' WHERE id = $1`, [id]);
  await q(
    `INSERT INTO enforcement_case_logs (case_id, event, actor) VALUES ($1, 'Справу закрито', $2)`,
    [id, auth.user?.full_name || 'System']
  );

  return NextResponse.json({ ok: true });
}
