export const dynamic = "force-dynamic";
// F5: NPS survey — public submit by token + GET by token to show survey
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const row = await one(
    "SELECT id, client_name, submitted_at FROM kompas_nps_surveys WHERE token=$1",
    [token],
  );
  if (!row) return NextResponse.json({ error: "Survey not found" }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    clientName: row.client_name,
    alreadySubmitted: !!row.submitted_at,
  });
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientIp(req), { max: 20, windowMs: 10 * 60_000, ns: "nps" });
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = String(body.token || "").trim();
  const score = Number(body.score);
  const comment = String(body.comment || "").trim().slice(0, 1000);

  if (!token || isNaN(score) || score < 0 || score > 10) {
    return NextResponse.json({ error: "token and score (0-10) required" }, { status: 400 });
  }

  const row = await one(
    "SELECT id, submitted_at FROM kompas_nps_surveys WHERE token=$1",
    [token],
  );
  if (!row) return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  if (row.submitted_at) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  await q(
    "UPDATE kompas_nps_surveys SET score=$1, comment=$2, submitted_at=now() WHERE token=$3",
    [score, comment || null, token],
  );

  return NextResponse.json({ ok: true });
}
