import { NextRequest, NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { verifyToken, signToken, COOKIE } from "@/lib/auth";
import { verify2FA } from "@/lib/totp";
import { rateLimit, checkLockout, recordFailure, resetLockout, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  // The 6-digit TOTP code was checked with no throttling at all — with a valid
  // tempToken (issued once the password already checked out) an attacker could
  // brute-force it with unlimited attempts within the code's validity window.
  const rl = rateLimit(ip, { max: 10, windowMs: 15 * 60_000, ns: "admin-2fa" });
  if (!rl.ok) {
    return NextResponse.json({ error: "Забагато спроб. Спробуйте через 15 хвилин." }, { status: 429 });
  }
  const lock = checkLockout(ip, { maxFailures: 5, lockMs: 15 * 60_000 });
  if (lock.locked) {
    return NextResponse.json(
      { error: `Забагато невдалих спроб. Спробуйте через ${lock.minutesLeft} хв.` },
      { status: 429 },
    );
  }

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
    recordFailure(ip, { maxFailures: 5, lockMs: 15 * 60_000 });
    return NextResponse.json({ error: "Неверный код 2FA" }, { status: 401 });
  }

  resetLockout(ip);

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
