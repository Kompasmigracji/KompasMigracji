export const dynamic = "force-dynamic";
/* /api/admin/leads/trash — корзина лидов.
   GET:    список удалённых лидов (deleted_at IS NOT NULL).
   PATCH:  восстановить лид (deleted_at = NULL).
   DELETE: окончательное удаление из БД (только для admin). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
       username,
       created_at,
       deleted_at
     FROM leads
     WHERE deleted_at IS NOT NULL
     ORDER BY deleted_at DESC
     LIMIT 200`
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
  if (!b.id) return NextResponse.json({ error: "Нужен id" }, { status: 400 });

  // Восстановить: убрать deleted_at
  await q("UPDATE leads SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL", [b.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  // Только admin может окончательно удалять
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id) return NextResponse.json({ error: "Нужен id" }, { status: 400 });

  // Удалить только из корзины (защита от случайного удаления активных)
  await q("DELETE FROM leads WHERE id = $1 AND deleted_at IS NOT NULL", [b.id]);
  return NextResponse.json({ ok: true });
}
