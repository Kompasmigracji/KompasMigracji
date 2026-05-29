// F3 admin: Manage subscriptions — list, cancel, activate
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = new URL(req.url).searchParams.get("status") || "active";

  const rows = await q(
    `SELECT s.id, s.plan_slug, s.plan_name, s.status, s.amount_pln,
            s.starts_at, s.ends_at, s.next_billing_at, s.email, s.client_name,
            s.renewal_notified, s.created_at,
            u.full_name AS member_name, u.email AS member_email
     FROM kompas_subscriptions s
     LEFT JOIN kompas_users u ON u.id = s.member_id
     WHERE s.status = $1
     ORDER BY s.created_at DESC LIMIT 100`,
    [status],
  );

  const stats = await one(
    `SELECT
       count(*) FILTER(WHERE status='active') AS active,
       count(*) FILTER(WHERE status='cancelled') AS cancelled,
       count(*) FILTER(WHERE status='past_due') AS past_due,
       COALESCE(sum(amount_pln) FILTER(WHERE status='active'),0) AS mrr
     FROM kompas_subscriptions`,
  );

  return NextResponse.json({ subscriptions: rows, stats });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  const newStatus = String(body.status || "");
  const allowed = ["active", "cancelled", "past_due", "expired", "trial"];

  if (!id || !allowed.includes(newStatus)) {
    return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
  }

  await q("UPDATE kompas_subscriptions SET status=$1 WHERE id=$2", [newStatus, id]);
  return NextResponse.json({ ok: true });
}
