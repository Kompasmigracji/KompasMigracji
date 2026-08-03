// app/api/architect/finance/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Real KPI aggregates for the CFO LLM / Finance page, sourced from
// `transactions` (db/migrations/018_lifeos_monetization_cfo.sql) — the same
// table app/architect/page.tsx already reads for its "Financial Load" tile.
// NOTE on scope: this intentionally does NOT reuse app/api/admin/revenue's
// query. That route computes CRM membership-dues revenue (kompas_dues /
// kompas_users, role='member' — B2B/B2C legal-service retainers), a
// different business entirely from the LifeOS "Academy" course/subscription
// sales this page is about. `transactions` is the correct, already-real
// source of truth for this page.
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const [revenue, subscriptions, payments] = await Promise.all([
      one(`
        SELECT
          coalesce(sum(amount) FILTER (WHERE status = 'completed' AND created_at >= now() - interval '30 days'), 0) AS last30,
          coalesce(sum(amount) FILTER (
            WHERE status = 'completed'
              AND created_at >= now() - interval '60 days'
              AND created_at < now() - interval '30 days'
          ), 0) AS prev30
        FROM transactions
      `),
      one(`
        SELECT count(*) AS cnt
        FROM transactions
        WHERE product_type = 'subscription'
          AND status = 'completed'
          AND created_at >= now() - interval '30 days'
      `),
      one(`
        SELECT
          count(*) FILTER (WHERE status = 'completed') AS completed,
          count(*) AS total
        FROM transactions
        WHERE created_at >= now() - interval '30 days'
      `),
    ]);

    const revenueLast30 = Number(revenue?.last30 || 0);
    const revenuePrev30 = Number(revenue?.prev30 || 0);
    const momPct = revenuePrev30 > 0
      ? Math.round(((revenueLast30 - revenuePrev30) / revenuePrev30) * 1000) / 10
      : null;

    const totalTx = Number(payments?.total || 0);
    const completedTx = Number(payments?.completed || 0);
    const paymentSuccessRate = totalTx > 0 ? Math.round((completedTx / totalTx) * 1000) / 10 : 0;

    return NextResponse.json({
      revenueLast30: Math.round(revenueLast30 * 100) / 100,
      revenueMomPct: momPct,
      subscriptionPayments30d: Number(subscriptions?.cnt || 0),
      paymentSuccessRate,
      completedTx30d: completedTx,
      totalTx30d: totalTx,
    });
  } catch (error: any) {
    console.error("Architect finance GET error:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}
