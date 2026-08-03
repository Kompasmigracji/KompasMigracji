// app/api/architect/cycle/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q } from "@/lib/db";
import { processSoul } from "@/lib/lifeos/soulEngine";
import { processFate } from "@/lib/lifeos/fateEngine";

// Manually runs the same SoulEngine/FateEngine analysis cycle that the
// scheduled daily cron (GET /api/cron/lifeos) runs automatically, gated by
// CRON_SECRET rather than a user session. This route is the authenticated
// admin-triggered equivalent — used by the "Re-run LifeOS Cycle Now" action
// on app/architect/settings/page.tsx, which used to be a "Rotate Application
// Keys" button with no handler and no real concept of an "application key"
// anywhere in this codebase for LifeOS to rotate.
export async function POST() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const recentLogs = await q(
      `SELECT source, message FROM system_logs ORDER BY created_at DESC LIMIT 50`
    );
    const recentTransactions = await q(
      `SELECT amount, status, product_type, created_at FROM transactions ORDER BY created_at DESC LIMIT 20`
    );

    const logMessages = recentLogs.map((l: any) => `[${l.source}] ${l.message}`).join("\n");

    const [soulOutput, fateOutput] = await Promise.all([
      processSoul({ recentLogs: logMessages, recentTransactions }),
      processFate({ recentLogs: logMessages, recentTransactions }),
    ]);

    await q(
      `INSERT INTO system_logs (level, source, message, details)
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        "info",
        "SoulEngine",
        `SoulEngine Cycle Completed: Vibe is ${soulOutput.vibe}`,
        JSON.stringify({ insights: soulOutput.insights, resonance: soulOutput.resonance, triggeredBy: "architect-panel" }),
        "info",
        "FateEngine",
        `FateEngine Cycle Completed: Status is ${fateOutput.status}`,
        JSON.stringify({ probabilities: fateOutput.probabilities, recommendation: fateOutput.recommendation, triggeredBy: "architect-panel" }),
      ]
    );

    return NextResponse.json({ success: true, soul: soulOutput, fate: fateOutput });
  } catch (error: any) {
    console.error("Architect cycle POST error:", error?.message || error);
    return NextResponse.json({ error: error.message || "Failed to run LifeOS cycle" }, { status: 500 });
  }
}
