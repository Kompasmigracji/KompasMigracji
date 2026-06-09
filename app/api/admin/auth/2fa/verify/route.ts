import { NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { verifyToken, signToken, COOKIE } from "@/lib/auth";
import { verify2FA } from "@/lib/totp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { tempToken, code } = body;
  if (!tempToken || !code) {
    return NextResponse.json({ error: "Токен и код обязательны" }, { status: 400 });
  }

  const payload = await verifyToken(tempToken);
  if (!payload || !payload.temp) {
    return NextResponse.json({ error: "Недействительный или истекший токен" }, { status: 401 });
  }

  const userId = payload.sub;
  if (!userId) {
    return NextResponse.json({ error: "Недействительный токен" }, { status: 401 });
  }

  let user;
  try {
    user = await one("select * from kompas_users where id = $1", [userId]);
  } catch (err: any) {
    console.error("[2fa-verify] DB error:", err.message);
    return NextResponse.json({ error: "Ошибка БД" }, { status: 503 });
  }

  if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
    return NextResponse.json({ error: "2FA не включена для данного пользователя" }, { status: 400 });
  }

  const isValid = verify2FA(code, user.two_factor_secret);
  if (!isValid) {
    return NextResponse.json({ error: "Неверный код 2FA" }, { status: 401 });
  }

  // Code valid, issue real token
  const token = await signToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.full_name,
  });

  Promise.all([
    q("update kompas_users set last_login = now() where id = $1", [user.id]),
    q("insert into kompas_audit_log (user_id, action, entity) values ($1, 'login_2fa', 'auth')", [user.id]),
  ]).catch((err: any) => console.error("[2fa-verify] Post-login update error:", err.message));

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
