/* /api/admin/workers/[id] — особистий кабiнет спiвробiтника.
   GET — профiль + поточнi справи + статистика. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const worker = await one(
    `SELECT id, full_name, email, role, status, last_login, created_at
     FROM kompas_users
     WHERE id = $1 AND role IN ('admin', 'moderator')`,
    [params.id]
  );
  if (!worker) return NextResponse.json({ error: "Спiвробiтника не знайдено" }, { status: 404 });

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
       COUNT(*) FILTER (WHERE status != 'closed')                                    AS active,
       COUNT(*) FILTER (WHERE status = 'closed')                                     AS closed,
       COUNT(*) FILTER (WHERE deadline_date < CURRENT_DATE AND status != 'closed')   AS overdue,
       COUNT(*)                                                                       AS total
     FROM cases WHERE assigned_to = $1`,
    [params.id]
  );

  return NextResponse.json({ worker, cases, stats });
}
