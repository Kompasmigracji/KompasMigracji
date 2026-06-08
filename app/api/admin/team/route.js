export const dynamic = "force-dynamic";
/* /api/admin/team — команда CMS (администраторы и модераторы).
   GET — список, POST — пригласить нового члена команды. Только admin. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth, hashPassword, tempPassword } from "@/lib/auth";

/* GET — администраторы и модераторы. */
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const team = await q(
    `select id, full_name, email, role, status, last_login, created_at
     from kompas_users
     where role in ('admin', 'moderator')
     order by role, created_at`
  );
  return NextResponse.json({ team });
}

/* POST — пригласить администратора или модератора. Возвращает временный пароль. */
export async function POST(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const email = String(b.email || "").toLowerCase().trim();
  const fullName = String(b.full_name || "").trim();
  const role = b.role === "admin" ? "admin" : "moderator";
  if (!email || !fullName) {
    return NextResponse.json({ error: "Имя и email обязательны" }, { status: 400 });
  }

  const exists = await one("select id from kompas_users where email = $1", [email]);
  if (exists) {
    return NextResponse.json({ error: "Пользователь с таким email уже есть" }, { status: 409 });
  }

  const pwd = tempPassword();
  const hash = await hashPassword(pwd);

  const user = await one(
    `insert into kompas_users (email, password_hash, full_name, role, status)
     values ($1, $2, $3, $4, 'active')
     returning id`,
    [email, hash, fullName, role]
  );

  await q(
    `insert into kompas_audit_log (user_id, action, entity, entity_id, meta)
     values ($1, 'team.invite', 'user', $2, $3)`,
    [auth.user.sub, String(user.id), JSON.stringify({ role })]
  );

  return NextResponse.json({ ok: true, id: user.id, role, temp_password: pwd });
}
