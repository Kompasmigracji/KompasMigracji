// app/api/architect/settings/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// `key`/`value` are guaranteed to exist on `architect_settings` post
// db/migrations/042_fix_architect_settings_and_system_logs_columns.sql
// (reconciles the key_name/key + value_json/value drift between
// 016_lifeos_core.sql and 017_lifeos_engines_logs.sql).
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const rows = await q(`SELECT key, value, updated_at FROM architect_settings ORDER BY key ASC`);
    const settings: Record<string, any> = {};
    for (const row of rows) settings[row.key] = row.value;
    return NextResponse.json({ settings, rows });
  } catch (error: any) {
    console.error("Architect settings GET error:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// Upserts a single key so a value survives even if the environment's
// architect_settings table hasn't been seeded with it yet.
export async function PATCH(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const { key, value } = body || {};
    if (!key || typeof key !== "string" || value === undefined) {
      return NextResponse.json({ error: "key (string) and value are required" }, { status: 400 });
    }

    const row = await one(
      `INSERT INTO architect_settings (key, value)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
       RETURNING key, value, updated_at`,
      [key, JSON.stringify(value)]
    );

    try {
      await q(
        `INSERT INTO system_logs (level, source, message, details) VALUES ($1, $2, $3, $4)`,
        [
          "info",
          "Architect Panel",
          `Setting "${key}" updated by admin`,
          JSON.stringify({ key, value, actorUserId: auth.user?.sub ?? auth.user?.id ?? null }),
        ]
      );
    } catch (logErr: any) {
      console.error("Architect settings: failed to write audit log:", logErr?.message || logErr);
    }

    return NextResponse.json({ setting: row });
  } catch (error: any) {
    console.error("Architect settings PATCH error:", error?.message || error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
