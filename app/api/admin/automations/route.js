/* GET /api/admin/automations — стан усіх автоматизацій + лог */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const [stateRows, logRows] = await Promise.all([
    q(`SELECT id, enabled, last_run, runs_total, errors_total
       FROM automation_states ORDER BY id`).catch(() => []),
    q(`SELECT automation_id AS auto, success AS ok, message AS msg, created_at AS ts
       FROM automation_logs ORDER BY created_at DESC LIMIT 50`).catch(() => []),
  ]);

  const states = {};
  for (const r of stateRows) {
    states[r.id] = {
      enabled: r.enabled,
      lastRun: r.last_run,
      runs: Number(r.runs_total) || 0,
      errors: Number(r.errors_total) || 0,
    };
  }

  const logs = logRows.map((r, i) => ({ id: i, ...r }));

  return NextResponse.json({ states, logs });
}
