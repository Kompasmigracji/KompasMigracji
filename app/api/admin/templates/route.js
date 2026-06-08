export const dynamic = "force-dynamic";
/* /api/admin/templates — CRUD для шаблонів повідомлень.
   GET:    список усіх шаблонів (з фільтром за категорією).
   POST:   створити новий шаблон (тільки admin).
   PUT:    оновити шаблон (тільки admin).
   DELETE: видалити шаблон (тільки admin). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const category = new URL(req.url).searchParams.get("category") || "";

  const rows = await q(
    `SELECT id, slug, category, title, body, auto_send, sort_order, created_at
     FROM message_templates
     WHERE ($1 = '' OR category = $1)
     ORDER BY sort_order ASC, id ASC`,
    [category]
  );
  return NextResponse.json({ templates: rows });
}

export async function POST(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (!b.slug || !b.category || !b.title || !b.body) {
    return NextResponse.json({ error: "Потрiбнi: slug, category, title, body" }, { status: 400 });
  }

  const row = await one(
    `INSERT INTO message_templates (slug, category, title, body, auto_send, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (slug) DO UPDATE
       SET title=EXCLUDED.title, body=EXCLUDED.body,
           category=EXCLUDED.category, auto_send=EXCLUDED.auto_send,
           sort_order=EXCLUDED.sort_order
     RETURNING *`,
    [b.slug, b.category, b.title, b.body, b.auto_send ?? false, b.sort_order ?? 0]
  );
  return NextResponse.json({ template: row }, { status: 201 });
}

export async function PUT(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (!b.id) return NextResponse.json({ error: "Потрiбен id" }, { status: 400 });

  const row = await one(
    `UPDATE message_templates
     SET slug=$2, category=$3, title=$4, body=$5, auto_send=$6, sort_order=$7
     WHERE id=$1
     RETURNING *`,
    [b.id, b.slug, b.category, b.title, b.body, b.auto_send ?? false, b.sort_order ?? 0]
  );
  if (!row) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });
  return NextResponse.json({ template: row });
}

export async function DELETE(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (!b.id) return NextResponse.json({ error: "Потрiбен id" }, { status: 400 });

  await q("DELETE FROM message_templates WHERE id=$1", [b.id]);
  return NextResponse.json({ ok: true });
}
