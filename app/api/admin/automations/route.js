/* GET /api/admin/automations — стан усіх автоматизацій + лог */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Зчитуємо стани з БД (таблиця automation_states)
    const rows = await db.query(
      `SELECT id, enabled, last_run, runs_total, errors_total
       FROM automation_states ORDER BY id`
    ).catch(() => ({ rows: [] }));

    const states = {};
    for (const r of rows.rows) {
      states[r.id] = {
        enabled: r.enabled,
        lastRun: r.last_run,
        runs: r.runs_total || 0,
        errors: r.errors_total || 0,
      };
    }

    // Зчитуємо останні 50 записів логу
    const logRows = await db.query(
      `SELECT automation_id as auto, success as ok, message as msg, created_at as ts
       FROM automation_logs ORDER BY created_at DESC LIMIT 50`
    ).catch(() => ({ rows: [] }));

    const logs = logRows.rows.map((r, i) => ({ id: i, ...r }));

    return NextResponse.json({ states, logs });
  } catch {
    return NextResponse.json({ states: {}, logs: [] });
  }
}
