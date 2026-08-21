export const maxDuration = 300;
export const dynamic = "force-dynamic";
/* Consolidated daily cron — runs 7 previously-unscheduled-but-fully-working
   cron handlers under a single Vercel cron entry.
   Why consolidated: each of these was written for its own cadence
   (appointment-reminders wanted every 2h, lead-followup every 6h,
   weekly-digest only on Monday), but this project is on Vercel's Hobby
   plan, which has a low cron-count limit that has broken deployment
   before (see commit history). Adding 7 more vercel.json entries risked
   repeating that. Instead this route calls all 7 handlers' real logic
   directly (each still works standalone too, gated by the same
   CRON_SECRET check) once daily:
     - appointment-reminders: safe daily - its own 20-28h lookahead window
       already sweeps forward every day, so a daily run never misses one.
     - lead-followup, dues-reminders, daily-snapshot, nps-survey,
       subscription-renewal: designed for ~daily cadence anyway.
     - weekly-digest: gated to Monday (UTC) below so it doesn't fire daily.
   Individual routes remain reachable on their own schedule if this
   project's plan/cron limits are raised later. */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
// Imports removed to prevent Next.js route export errors
import { runPaymentReverify } from "@/lib/payment-reverify";

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return authHeader === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

async function callCronRoute(name: string, req: NextRequest) {
  try {
    const url = new URL(`/api/cron/${name}`, req.url);
    const authHeader = req.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) headers["authorization"] = authHeader;
    else if (process.env.CRON_SECRET) headers["authorization"] = `Bearer ${process.env.CRON_SECRET}`;
    
    const res = await fetch(url.toString(), { headers });
    const data = await res.json().catch(() => ({}));
    return { name, ok: res.ok, ...data };
  } catch (e) {
    console.error(`[daily-ops] ${name} failed:`, e);
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function safe(name: string, fn: () => Promise<any>) {
  try {
    return { name, ...(await fn()) };
  } catch (e) {
    console.error(`[daily-ops] ${name} failed:`, e);
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isMonday = new Date().getUTCDay() === 1;

  const results = await Promise.all([
    callCronRoute("appointment-reminders", req),
    callCronRoute("daily-snapshot", req),
    callCronRoute("dues-reminders", req),
    callCronRoute("lead-followup", req),
    /* Платежі, які P24 не підтвердив — гроші клієнта вже списані, тож ця
       задача має шанс повернути реальні злоті, а не просто прибрати помилку. */
    safe("payment-reverify", runPaymentReverify),
    callCronRoute("nps-survey", req),
    callCronRoute("subscription-renewal", req),
    ...(isMonday ? [callCronRoute("weekly-digest", req)] : []),
  ]);

  return NextResponse.json({ ok: true, ran: results });
}
