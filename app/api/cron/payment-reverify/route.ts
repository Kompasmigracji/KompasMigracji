export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* /api/cron/payment-reverify — HTTP-обгортка над lib/payment-reverify.
 *
 * Викликається з /api/cron/daily-ops (проєкт на Hobby-плані, де ліміт
 * cron-записів у vercel.json уже одного разу ламав деплой), або вручну
 * адміном через POST — щоб не чекати добу після полагодження ключа P24. */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { runPaymentReverify } from "@/lib/payment-reverify";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get("authorization") === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await runPaymentReverify());
}

export async function POST() {
  const auth = await requireAuth(["admin"]);
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }
  return NextResponse.json(await runPaymentReverify());
}
