// app/api/architect/modules/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// `name`/`updated_at` are guaranteed to exist on `system_modules` post
// db/migrations/041_fix_system_modules_columns.sql (reconciles the
// module_name/name + updated_at/last_updated_at drift between
// 016_lifeos_core.sql and 017_lifeos_engines_logs.sql).
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const modules = await q(
      `SELECT id, name, is_active, updated_at FROM system_modules ORDER BY name ASC`
    );
    return NextResponse.json({ modules });
  } catch (error: any) {
    console.error("Architect modules GET error:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch system modules" }, { status: 500 });
  }
}

// Toggles (or otherwise updates) is_active on a single module row so state
// persists across reloads instead of resetting to the hardcoded defaults.
export async function PATCH(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const { id, is_active } = body || {};
    if (id === undefined || id === null || typeof is_active !== "boolean") {
      return NextResponse.json({ error: "id and is_active (boolean) are required" }, { status: 400 });
    }

    const row = await one(
      `UPDATE system_modules
       SET is_active = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, name, is_active, updated_at`,
      [is_active, id]
    );

    if (!row) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Best-effort audit trail in system_logs — mirrors the other real LifeOS
    // writers (cron, ALEX-DIGITAL). Never blocks the toggle on failure.
    try {
      await q(
        `INSERT INTO system_logs (level, source, message, details) VALUES ($1, $2, $3, $4)`,
        [
          "info",
          "Architect Panel",
          `Module "${row.name}" ${is_active ? "activated" : "deactivated"} by admin`,
          JSON.stringify({ moduleId: id, is_active, actorUserId: auth.user?.sub ?? auth.user?.id ?? null }),
        ]
      );
    } catch (logErr: any) {
      console.error("Architect modules: failed to write audit log:", logErr?.message || logErr);
    }

    return NextResponse.json({ module: row });
  } catch (error: any) {
    console.error("Architect modules PATCH error:", error?.message || error);
    return NextResponse.json({ error: "Failed to update system module" }, { status: 500 });
  }
}
