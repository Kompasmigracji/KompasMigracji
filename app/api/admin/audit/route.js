export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const rows = await q(
      `SELECT
         a.id,
         a.action,
         a.entity,
         a.entity_id,
         a.meta,
         a.created_at,
         u.full_name as actor_name,
         u.email as actor_email
       FROM kompas_audit_log a
       LEFT JOIN kompas_users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 200`
    );

    return NextResponse.json({ logs: rows });
  } catch (error) {
    console.error("Audit log GET error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
