export const dynamic = "force-dynamic";
/* POST /api/admin/auth/login — вход, видає JWT в httpOnly-cookie. */
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

  let user;
  try {
    user = await one(
      "select * from kompas_users where email = $1 and status = 'active'",
      [email]
    );
  } catch (err) {
    console.error("[login] DB error:", err.message);
    return NextResponse.json(
      { error: "Ошибка подключения к базе данных. Проверьте переменные окружения на Vercel." },
      { status: 503 }
    );
  }

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const token = await signToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.full_name,
  });

  // Оновлюємо last_login та audit log (non-blocking — не критично)
  Promise.all([
    q("update kompas_users set last_login = now() where id = $1", [user.id]),
    q("insert into kompas_audit_log (user_id, action, entity) values ($1, 'login', 'auth')", [user.id]),
  ]).catch((err) => console.error("[login] Post-login update error:", err.message));

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
