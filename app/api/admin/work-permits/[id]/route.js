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
       p.*,
       u.full_name AS worker_name,
       CASE WHEN p.decision_deadline IS NOT NULL
            THEN (p.decision_deadline - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM work_permits p
     LEFT JOIN kompas_users u ON u.id = p.assigned_to
     WHERE p.id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = await q(
    `SELECT * FROM work_permit_logs WHERE permit_id = $1 ORDER BY created_at DESC`,
    [id]
  );

  return NextResponse.json({ permit: row, logs });
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
  sets.push(`"updated_at" = CURRENT_TIMESTAMP`);
  vals.push(id);

  const sql = `UPDATE work_permits SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`;
  const row = await one(sql, vals);

  if (row) {
    let evt = `Оновлено: ${keys.join(", ")}`;
    if (keys.includes("stage")) {
      const st = {
        "preparation":  "Підготовка документів",
        "submitted":    "Подано до Urzędu",
        "under_review": "На розгляді",
        "approved":     "Затверджено",
        "rejected":     "Відхилено",
      };
      evt = `Статус змінено на: ${st[b.stage] || b.stage}`;
    }
    await q(
      `INSERT INTO work_permit_logs (permit_id, event, actor) VALUES ($1, $2, $3)`,
      [id, evt, auth.user?.full_name || 'System']
    );
  }

  return NextResponse.json({ permit: row });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await q(`UPDATE work_permits SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
  await q(
    `INSERT INTO work_permit_logs (permit_id, event, actor) VALUES ($1, 'Заявку закрито', $2)`,
    [id, auth.user?.full_name || 'System']
  );

  return NextResponse.json({ ok: true });
}
