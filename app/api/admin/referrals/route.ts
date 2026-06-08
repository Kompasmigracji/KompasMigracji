export const dynamic = "force-dynamic";
/* Innovation 2: Referral Program API
   F4: GET — list + stats; POST — generate unique ref code for user
   F5: Conversion tracking handled by /api/ref/[code]
   F6: Reward auto-calculation on conversion */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { randomBytes } from "crypto";

function genCode(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rows = await q(`
    SELECT r.id, r.code, r.clicks, r.conversions, r.reward_total, r.created_at,
           u.full_name AS user_name, u.email AS user_email
    FROM kompas_referrals r
    JOIN kompas_users u ON u.id = r.user_id
    ORDER BY r.conversions DESC, r.clicks DESC`);

  const totals = await one(`
    SELECT sum(clicks) AS clicks, sum(conversions) AS conversions,
           sum(reward_total) AS rewards
    FROM kompas_referrals`);

  return NextResponse.json({
    referrals: rows.map((r: any) => ({
      ...r,
      clicks: Number(r.clicks),
      conversions: Number(r.conversions),
      reward_total: Number(r.reward_total),
    })),
    totals: {
      clicks: Number(totals?.clicks || 0),
      conversions: Number(totals?.conversions || 0),
      rewards: Number(totals?.rewards || 0),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { userId?: unknown; reward?: unknown } = {};
  try { body = await req.json(); } catch { /* empty body = generate for admin */ }

  const userId = body.userId ? Number(body.userId) : null;

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  // F4: Generate unique code (retry if collision)
  let code = genCode();
  for (let i = 0; i < 5; i++) {
    const existing = await one("SELECT id FROM kompas_referrals WHERE code=$1", [code]);
    if (!existing) break;
    code = genCode();
  }

  const row = await one(
    `INSERT INTO kompas_referrals (user_id, code) VALUES ($1, $2)
     ON CONFLICT (code) DO NOTHING
     RETURNING id, code`,
    [userId, code],
  );

  if (!row) {
    return NextResponse.json({ error: "Code collision — retry" }, { status: 409 });
  }

  return NextResponse.json({ id: row.id, code: row.code });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { id?: unknown; reward?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // F6: Manual reward mark (admin can override auto amount)
  const reward = Number(body.reward || 0);
  await q(
    `UPDATE kompas_referrals SET reward_total = $2 WHERE id = $1`,
    [body.id, reward],
  );

  return NextResponse.json({ ok: true });
}
