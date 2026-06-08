export const dynamic = "force-dynamic";
/* /api/admin/workers — команда (admin + moderator) зі статистикою.
   GET  — список (admin + moderator).
   POST — створити нового спеціаліста (тільки admin). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth, hashPassword, tempPassword } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const workers = await q(
    `SELECT
       u.id, u.full_name, u.email, u.role, u.status, u.last_login,
       COUNT(c.id) FILTER (WHERE c.status != 'closed')                                    AS active_cases,
       COUNT(c.id) FILTER (WHERE c.status = 'closed')                                     AS closed_cases,
       COUNT(c.id) FILTER (WHERE c.deadline_date < CURRENT_DATE AND c.status != 'closed') AS overdue_cases,
       COUNT(c.id)                                                                         AS total_cases
     FROM kompas_users u
     LEFT JOIN cases c ON c.assigned_to = u.id
     WHERE u.role IN ('admin', 'moderator')
     GROUP BY u.id, u.full_name, u.email, u.role, u.status, u.last_login
     ORDER BY u.role, u.full_name`
  );

  return NextResponse.json({ workers });
}

export async function POST(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }

  const email    = String(b.email    || "").toLowerCase().trim();
  const fullName = String(b.full_name || "").trim();
  const role     = ["admin", "moderator"].includes(b.role) ? b.role : "moderator";

  if (!email || !fullName)
    return NextResponse.json({ error: "Ім'я та email обов'язкові" }, { status: 400 });

  const exists = await one("SELECT id FROM kompas_users WHERE email = $1", [email]);
  if (exists)
    return NextResponse.json({ error: "Користувач з таким email вже існує" }, { status: 409 });

  const pwd  = b.password ? String(b.password) : tempPassword();
  const hash = await hashPassword(pwd);

  const user = await one(
    `INSERT INTO kompas_users (email, password_hash, full_name, role, status)
     VALUES ($1, $2, $3, $4, 'active') RETURNING id`,
    [email, hash, fullName, role]
  );

  return NextResponse.json({ ok: true, id: user.id, temp_password: b.password ? undefined : pwd });
}
