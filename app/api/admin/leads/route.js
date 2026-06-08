export const dynamic = "force-dynamic";
/* /api/admin/leads — лиды из таблицы leads (бот + сайт).
   GET:    список активных лидов (deleted_at IS NULL) с фильтром по статусу.
   PATCH:  смена статуса лида.
   DELETE: мягкое удаление (переместить в корзину — устанавливает deleted_at). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = new URL(req.url).searchParams.get("status") || "";

  const rows = await q(
    `SELECT
       id,
       CASE
         WHEN chat_id IS NOT NULL THEN 'bot'
         WHEN source = 'main'     THEN 'site'
         WHEN source IS NOT NULL AND source != '' THEN source
         ELSE 'site'
       END AS source,
       COALESCE(first_name, '') AS name,
       COALESCE(contact, '')    AS contact,
       COALESCE(situation, '')  AS message,
       COALESCE(status, 'new')  AS status,
       country,
       service,
       urgency,
       username,
       chat_id,
       created_at
     FROM leads
     WHERE deleted_at IS NULL
       AND ($1 = '' OR COALESCE(status, 'new') = $1)
     ORDER BY created_at DESC
     LIMIT 300`,
    [status]
  );
  return NextResponse.json({ leads: rows });
}

export async function PATCH(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id || !b.status) {
    return NextResponse.json({ error: "Нужны id и status" }, { status: 400 });
  }
  await q("UPDATE leads SET status = $2 WHERE id = $1 AND deleted_at IS NULL", [b.id, b.status]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id) {
    return NextResponse.json({ error: "Нужен id" }, { status: 400 });
  }
  // Soft-delete: переместить в корзину
  await q("UPDATE leads SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", [b.id]);
  return NextResponse.json({ ok: true });
}
