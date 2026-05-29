/* Innovation 4: Client Portal Auth
   F10: PIN lookup — returns case data if PIN matches
   F12: Auto log access timestamp */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: { pin?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pin = String(body.pin || "").trim().toUpperCase();
  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 });
  }

  const session = await one(
    "SELECT * FROM kompas_portal_sessions WHERE pin=$1",
    [pin],
  );

  if (!session) {
    return NextResponse.json({ error: "Невірний PIN. Перевірте і спробуйте ще раз." }, { status: 404 });
  }

  // F12: Log access
  await q(
    "UPDATE kompas_portal_sessions SET accessed_at=now() WHERE pin=$1",
    [pin],
  );

  // Fetch associated lead/case data
  let leadData = null;
  if (session.lead_id) {
    leadData = await one(
      `SELECT id, first_name, COALESCE(status,'new') AS status,
              service, urgency, situation, created_at, paid_at
       FROM leads WHERE id=$1 AND deleted_at IS NULL`,
      [session.lead_id],
    );
  }

  return NextResponse.json({
    pin,
    clientName: session.client_name,
    service: session.service || leadData?.service,
    status: leadData?.status || session.status,
    urgency: leadData?.urgency,
    notes: session.notes,
    createdAt: session.created_at,
    accessedAt: new Date().toISOString(),
  });
}
