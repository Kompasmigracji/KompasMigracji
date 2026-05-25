/* POST /api/admin/auth/login — вход, выдаёт JWT в httpOnly-cookie. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { verifyPassword, signToken, COOKIE } from "@/lib/auth";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json({ error: "Введите email и пароль" }, { status: 400 });
  }

  const user = await one(
    "select * from kompas_users where email = $1 and status = 'active'",
    [email]
  );
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const token = await signToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.full_name,
  });

  await q("update kompas_users set last_login = now() where id = $1", [user.id]);
  await q(
    "insert into kompas_audit_log (user_id, action, entity) values ($1, 'login', 'auth')",
    [user.id]
  );

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role, name: user.full_name },
  });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
