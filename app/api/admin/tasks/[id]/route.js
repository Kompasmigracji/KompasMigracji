/* /api/admin/tasks/[id] — GET | PATCH | DELETE */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const STAGE_LABEL = {
  todo:        "Нові завдання",
  in_progress: "В роботі",
  review:      "На перевірці",
  done:        "Завершено",
};

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const task = await one(
    `SELECT t.*, u.full_name AS assignee_name,
       CASE WHEN t.deadline IS NOT NULL THEN (t.deadline - CURRENT_DATE)::int ELSE NULL END AS days_left
     FROM tasks t
     LEFT JOIN kompas_users u ON u.id = t.assigned_to
     WHERE t.id = $1`,
    [params.id]
  );
  if (!task) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  const [documents, logs, aiChat] = await Promise.all([
    q("SELECT * FROM task_documents WHERE task_id=$1 ORDER BY created_at DESC", [params.id]),
    q("SELECT * FROM task_logs      WHERE task_id=$1 ORDER BY created_at ASC",  [params.id]),
    q("SELECT * FROM task_ai_chat   WHERE task_id=$1 ORDER BY created_at ASC LIMIT 100", [params.id]),
  ]);

  return NextResponse.json({ task, documents, logs, aiChat });
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }

  const allowed = ["title","description","category","stage","status","priority","assigned_to","deadline"];
  const sets = [];
  const vals = [];
  for (const k of allowed) {
    if (k in b) { sets.push(`${k}=$${vals.length + 1}`); vals.push(b[k]); }
  }
  if (!sets.length) return NextResponse.json({ error: "Нема полів для оновлення" }, { status: 400 });

  sets.push("updated_at=NOW()");
  vals.push(params.id);

  const task = await one(
    `UPDATE tasks SET ${sets.join(",")} WHERE id=$${vals.length} RETURNING *`,
    vals
  );
  if (!task) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  if (b.stage) {
    await q(
      `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,$2,$3)`,
      [params.id, `Етап: ${STAGE_LABEL[b.stage] || b.stage}`, auth.user.name || "менеджер"]
    );
  }
  if (b.status === "closed") {
    await q(
      `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,'Завдання закрито',$2)`,
      [params.id, auth.user.name || "менеджер"]
    );
  }
  if (b.status === "active" && !b.stage) {
    await q(
      `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,'Завдання відновлено',$2)`,
      [params.id, auth.user.name || "менеджер"]
    );
  }
  if ("assigned_to" in b) {
    const label = b.assigned_to ? `Призначено виконавця (id=${b.assigned_to})` : "Призначення знято";
    await q(
      `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,$2,$3)`,
      [params.id, label, auth.user.name || "менеджер"]
    );
  }

  return NextResponse.json({ task });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await q("DELETE FROM tasks WHERE id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}
