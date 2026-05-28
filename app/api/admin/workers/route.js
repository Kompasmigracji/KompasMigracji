/* /api/admin/workers — команда (admin + moderator) зi статистикою справ.
   GET — список усiх спiвробiтникiв + кiлькiсть справ по кожному. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const workers = await q(
    `SELECT
       u.id, u.full_name, u.email, u.role, u.status, u.last_login,
       COUNT(c.id) FILTER (WHERE c.status != 'closed')                                  AS active_cases,
       COUNT(c.id) FILTER (WHERE c.status = 'closed')                                   AS closed_cases,
       COUNT(c.id) FILTER (WHERE c.deadline_date < CURRENT_DATE AND c.status != 'closed') AS overdue_cases,
       COUNT(c.id)                                                                       AS total_cases
     FROM kompas_users u
     LEFT JOIN cases c ON c.assigned_to = u.id
     WHERE u.role IN ('admin', 'moderator')
     GROUP BY u.id, u.full_name, u.email, u.role, u.status, u.last_login
     ORDER BY u.role, u.full_name`
  );

  return NextResponse.json({ workers });
}
