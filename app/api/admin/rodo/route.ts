export const dynamic = "force-dynamic";
/* /api/admin/rodo — GDPR/RODO Compliance Dashboard API.
   Requires admin role authentication.
   GET  -> Fetch RODO audit log list
   POST -> Trigger manual account deletion/PII purging */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db.js";
import { requireAuth } from "@/lib/auth.js";
import { purgeUserData } from "@/lib/rodo";

/**
 * GET: Retrieve RODO consent logs
 */
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const logs = await q(
      `SELECT l.id, l.email, l.phone, l.action_type, l.ip_address, l.created_at, 
              u.full_name AS user_name, l.user_id
         FROM kompas_rodo_consent_logs l 
         LEFT JOIN kompas_users u ON u.id = l.user_id 
        ORDER BY l.created_at DESC 
        LIMIT 100`
    );

    return NextResponse.json({ logs });
  } catch (err: unknown) {
    console.error("[api/admin/rodo] Error fetching RODO logs:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
  }
}

/**
 * POST: Force manual client profile erasure (Right to be Forgotten)
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const userId = Number(body.userId);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "CRM admin portal";

    await purgeUserData(userId, ip, userAgent);

    return NextResponse.json({ ok: true, message: `User ID ${userId} has been purged successfully.` });
  } catch (err: unknown) {
    console.error("[api/admin/rodo] Error executing user purge:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to purge user records" }, { status: 500 });
  }
}
