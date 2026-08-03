// app/api/architect/logs/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Returns recent rows from `system_logs` — populated by the LifeOS daily
// cron (app/api/cron/lifeos/route.ts) and by ALEX-DIGITAL
// (lib/lifeos/alexDigital.ts) among others. `details` is guaranteed to exist
// post db/migrations/042_fix_architect_settings_and_system_logs_columns.sql.
export async function GET(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const rawLimit = parseInt(searchParams.get("limit") || "150", 10);
  const limit = Math.min(Math.max(Number.isFinite(rawLimit) ? rawLimit : 150, 1), 500);
  const source = searchParams.get("source");

  try {
    const logs = source
      ? await q(
          `SELECT id, level, source, message, details, created_at
           FROM system_logs
           WHERE source = $1
           ORDER BY created_at DESC
           LIMIT $2`,
          [source, limit]
        )
      : await q(
          `SELECT id, level, source, message, details, created_at
           FROM system_logs
           ORDER BY created_at DESC
           LIMIT $1`,
          [limit]
        );

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Architect logs GET error:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch system logs" }, { status: 500 });
  }
}
