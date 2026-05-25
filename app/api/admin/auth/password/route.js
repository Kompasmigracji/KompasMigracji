/* POST /api/admin/auth/password — смена собственного пароля.
   Доступно любому залогиненному пользователю (admin / moderator / member). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const current = String(b.current || "");
  const next = String(b.next || "");
  if (next.length < 6) {
    return NextResponse.json({ error: "Новый пароль — минимум 6 символов" }, { status: 400 });
  }

  const user = await one(
    "select id, password_hash from kompas_users where id = $1",
    [auth.user.sub]
  );
  if (!user || !(await verifyPassword(current, user.password_hash))) {
    return NextResponse.json({ error: "Текущий пароль неверен" }, { status: 403 });
  }

  await q(
    "update kompas_users set password_hash = $2 where id = $1",
    [user.id, await hashPassword(next)]
  );
  await q(
    "insert into kompas_audit_log (user_id, action, entity) values ($1, 'password.change', 'auth')",
    [user.id]
  );
  return NextResponse.json({ ok: true });
}
