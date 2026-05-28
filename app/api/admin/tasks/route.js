/* /api/admin/tasks — список і створення завдань. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const tasks = await q(
    `SELECT
       t.id, t.title, t.description, t.category, t.stage, t.status,
       t.priority, t.deadline, t.created_at, t.assigned_to,
       u.full_name AS assignee_name,
       COUNT(td.id)::int AS doc_count,
       CASE WHEN t.deadline IS NOT NULL
            THEN (t.deadline - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM tasks t
     LEFT JOIN kompas_users u ON u.id = t.assigned_to
     LEFT JOIN task_documents td ON td.task_id = t.id
     GROUP BY t.id, u.full_name
     ORDER BY
       CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END,
       CASE WHEN t.deadline IS NOT NULL THEN (t.deadline - CURRENT_DATE)::int ELSE 9999 END ASC,
       t.created_at DESC`
  );

  return NextResponse.json({ tasks });
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }

  if (!b.title?.trim()) return NextResponse.json({ error: "Вкажіть назву завдання" }, { status: 400 });

  const stage    = ["todo","in_progress","review","done"].includes(b.stage)       ? b.stage    : "todo";
  const priority = ["low","normal","high","urgent"].includes(b.priority)           ? b.priority : "normal";
  const category = ["general","legal","admin","research"].includes(b.category)     ? b.category : "general";

  const task = await one(
    `INSERT INTO tasks (title, description, category, stage, priority, assigned_to, deadline, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      b.title.trim(),
      b.description || null,
      category,
      stage,
      priority,
      b.assigned_to || null,
      b.deadline    || null,
      auth.user.sub,
    ]
  );

  await q(
    `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,'Завдання створено',$2)`,
    [task.id, auth.user.name || "менеджер"]
  );

  return NextResponse.json({ task }, { status: 201 });
}
