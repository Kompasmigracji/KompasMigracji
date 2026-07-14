export const dynamic = "force-dynamic";
/* GET /api/payment/status?session=xxx
   Публічний ендпоінт для сторінки /payment/success — перевіряє, чи лід
   з таким session_id вже позначений оплаченим (paid_at заповнений через
   webhook провайдера: /api/payment-notify, /api/payu/notify, /api/stripe/webhook). */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  try {
    const lead = (await one(
      `SELECT paid_at FROM leads WHERE session_id = $1 AND deleted_at IS NULL LIMIT 1`,
      [sessionId],
    )) as { paid_at: string | null } | null;

    if (!lead) {
      return NextResponse.json({ status: "unknown" });
    }
    return NextResponse.json({ status: lead.paid_at ? "paid" : "pending" });
  } catch (err) {
    console.error("payment/status error:", err);
    return NextResponse.json({ status: "unknown" });
  }
}
