/* POST /api/admin/setup — one-time bootstrap: creates first admin user.
   Returns 403 if any admin already exists. Safe to call on empty DB. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { hashPassword, signToken, COOKIE } from "@/lib/auth";

export async function GET() {
  try {
    const row = await one(
      "SELECT count(*) AS n FROM kompas_users WHERE role='admin'"
    );
    return NextResponse.json({ needsSetup: Number(row?.n || 0) === 0 });
  } catch (err) {
    return NextResponse.json({ needsSetup: true, dbError: err.message });
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { full_name, email, password } = body;

  if (!full_name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "Ім'я, email та пароль обов'язкові" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Пароль — мінімум 8 символів" },
      { status: 400 }
    );
  }

  // Check if any admin already exists
  let adminCount;
  try {
    const row = await one(
      "SELECT count(*) AS n FROM kompas_users WHERE role='admin'"
    );
    adminCount = Number(row?.n || 0);
  } catch (err) {
    return NextResponse.json(
      { error: "Помилка підключення до БД: " + err.message },
      { status: 503 }
    );
  }

  if (adminCount > 0) {
    return NextResponse.json(
      { error: "Адміністратор вже існує. Використайте /admin/login." },
      { status: 403 }
    );
  }

  // Check email uniqueness
  const existing = await one(
    "SELECT id FROM kompas_users WHERE email=$1",
    [email.toLowerCase().trim()]
  );
  if (existing) {
    return NextResponse.json(
      { error: "Цей email вже зареєстровано" },
      { status: 409 }
    );
  }

  const password_hash = await hashPassword(password);

  let user;
  try {
    user = await one(
      `INSERT INTO kompas_users (full_name, email, password_hash, role, status)
       VALUES ($1, $2, $3, 'admin', 'active')
       RETURNING id, full_name, email, role`,
      [full_name.trim(), email.toLowerCase().trim(), password_hash]
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Помилка створення: " + err.message },
      { status: 500 }
    );
  }

  // Log the setup action
  await q(
    "INSERT INTO kompas_audit_log (user_id, action, entity) VALUES ($1, 'setup_admin', 'auth')",
    [user.id]
  ).catch(() => {});

  const token = await signToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.full_name,
  });

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
