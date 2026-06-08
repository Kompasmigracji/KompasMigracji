export const dynamic = "force-dynamic";
/* /api/admin/tasks/[id]/documents — POST (додати) | DELETE (видалити) */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }

  if (!b.name?.trim()) return NextResponse.json({ error: "Вкажіть назву документу" }, { status: 400 });
  if (!b.url?.trim())  return NextResponse.json({ error: "Вкажіть посилання" }, { status: 400 });

  const doc = await one(
    `INSERT INTO task_documents (task_id, name, url, notes, uploaded_by)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [params.id, b.name.trim(), b.url.trim(), b.notes || null, auth.user.sub]
  );

  await q(
    `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,$2,$3)`,
    [params.id, `Документ додано: ${b.name}`, auth.user.name || "менеджер"]
  );

  return NextResponse.json({ doc }, { status: 201 });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("doc_id");
  if (!docId) return NextResponse.json({ error: "doc_id обов'язковий" }, { status: 400 });

  const doc = await one(
    "SELECT name FROM task_documents WHERE id=$1 AND task_id=$2",
    [docId, params.id]
  );
  if (!doc) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  await q("DELETE FROM task_documents WHERE id=$1", [docId]);
  await q(
    `INSERT INTO task_logs (task_id, event, actor_name) VALUES ($1,$2,$3)`,
    [params.id, `Документ видалено: ${doc.name}`, auth.user.name || "менеджер"]
  );

  return NextResponse.json({ ok: true });
}
