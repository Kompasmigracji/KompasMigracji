export const dynamic = "force-dynamic";
/* /api/admin/workers/[id]
   GET    — профіль + активні справи + статистика (admin + moderator).
   PATCH  — редагувати спеціаліста (тільки admin).
   DELETE — видалити (тільки admin; неможливо якщо є активні справи). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth, hashPassword } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const worker = await one(
    `SELECT id, full_name, email, role, status, last_login, created_at
     FROM kompas_users
     WHERE id = $1 AND role IN ('admin', 'moderator')`,
    [params.id]
  );
  if (!worker) return NextResponse.json({ error: "Співробітника не знайдено" }, { status: 404 });

  const cases = await q(
    `SELECT *,
       CASE WHEN deadline_date IS NOT NULL
            THEN (deadline_date - CURRENT_DATE)::int
            ELSE NULL
       END AS days_left
     FROM cases
     WHERE assigned_to = $1 AND status != 'closed'
     ORDER BY
       CASE WHEN deadline_date IS NOT NULL
            THEN (deadline_date - CURRENT_DATE)::int
            ELSE 9999
       END ASC,
       created_at DESC`,
    [params.id]
  );

  const stats = await one(
    `SELECT
       COUNT(*) FILTER (WHERE status != 'closed')                                  AS active,
       COUNT(*) FILTER (WHERE status = 'closed')                                   AS closed,
       COUNT(*) FILTER (WHERE deadline_date < CURRENT_DATE AND status != 'closed') AS overdue,
       COUNT(*)                                                                     AS total
     FROM cases WHERE assigned_to = $1`,
    [params.id]
  );

  return NextResponse.json({ worker, cases, stats });
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Некоректний запит" }, { status: 400 }); }

  const worker = await one(
    "SELECT id FROM kompas_users WHERE id = $1 AND role IN ('admin','moderator')",
    [params.id]
  );
  if (!worker) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });

  const allowed = ["full_name", "email", "role", "status"];
  const updates = [];
  const vals    = [];

  for (const key of allowed) {
    if (key in b && b[key] !== undefined) {
      updates.push(`${key} = $${vals.length + 1}`);
      vals.push(key === "email" ? String(b[key]).toLowerCase().trim() : b[key]);
    }
  }

  if (b.password) {
    const hash = await hashPassword(String(b.password));
    updates.push(`password_hash = $${vals.length + 1}`);
    vals.push(hash);
  }

  if (updates.length) {
    vals.push(params.id);
    await q(`UPDATE kompas_users SET ${updates.join(", ")} WHERE id = $${vals.length}`, vals);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  if (String(auth.user.sub) === String(params.id))
    return NextResponse.json({ error: "Не можна видалити власний акаунт" }, { status: 400 });

  const active = await one(
    "SELECT COUNT(*) AS n FROM cases WHERE assigned_to = $1 AND status != 'closed'",
    [params.id]
  );
  if (Number(active.n) > 0)
    return NextResponse.json(
      { error: `Спочатку закрийте або переназначте ${active.n} активних справ` },
      { status: 400 }
    );

  await q("DELETE FROM kompas_users WHERE id = $1 AND role IN ('admin','moderator')", [params.id]);
  return NextResponse.json({ ok: true });
}
