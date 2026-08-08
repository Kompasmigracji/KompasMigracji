export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* POST /api/portal/auth — вхід клієнта в портал за PIN.
 *
 * Раніше повертав одне слово статусу ліда. Тепер віддає ще й замовлення з
 * номерами KM-000123, стан оплати і найближчі терміни — те, заради чого
 * клієнт узагалі відкриває портал.
 *
 * Межа доступу: PIN → lead_id → дані ЦЬОГО ліда. Жодного ідентифікатора з
 * боку клієнта, окрім самого PIN, у запитах не бере участі, тож підставити
 * чужий lead_id неможливо. Rate-limit і lockout з попередньої версії
 * збережені — PIN шестисимвольний, і перебір має лишатися дорогим. */

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { rateLimit, checkLockout, recordFailure, resetLockout, clientIp } from "@/lib/rate-limit";
import { getPortalOrders, getPortalDeadlines, clientFacingPaymentStatus } from "@/lib/portal";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const rl = rateLimit(ip, { max: 10, windowMs: 15 * 60_000, ns: "portal-auth" });
  if (!rl.ok) {
    return NextResponse.json({ error: "Забагато спроб. Спробуйте через 15 хвилин." }, { status: 429 });
  }

  const lock = checkLockout(ip, { maxFailures: 5, lockMs: 15 * 60_000 });
  if (lock.locked) {
    return NextResponse.json(
      { error: `Доступ тимчасово заблоковано. Спробуйте через ${lock.minutesLeft} хв.` },
      { status: 429 },
    );
  }

  let body: { pin?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pin = String(body.pin || "").trim().toUpperCase();
  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: "Введіть PIN" }, { status: 400 });
  }

  const session = (await one(
    "SELECT * FROM kompas_portal_sessions WHERE pin = $1",
    [pin],
  )) as {
    lead_id: string | null;
    client_name: string | null;
    service: string | null;
    status: string | null;
    notes: string | null;
    created_at: string;
  } | null;

  if (!session) {
    recordFailure(ip, { maxFailures: 5, lockMs: 15 * 60_000 });
    return NextResponse.json({ error: "Невірний PIN. Перевірте і спробуйте ще раз." }, { status: 401 });
  }

  resetLockout(ip);
  await q("UPDATE kompas_portal_sessions SET accessed_at = now() WHERE pin = $1", [pin]);

  /* Іменований тип, а не `typeof lead`: після `= null` TypeScript звужує
     змінну до null, і каст `as typeof lead` схлопується в never. */
  type LeadRow = {
    id: string;
    first_name: string | null;
    status: string;
    service: string | null;
    urgency: string | null;
    situation: string | null;
    created_at: string;
    paid_at: string | null;
    chat_id: number | null;
    email: string | null;
  };

  let lead: LeadRow | null = null;

  if (session.lead_id) {
    lead = (await one(
      `SELECT id, first_name, COALESCE(status,'new') AS status, service, urgency,
              situation, created_at, paid_at, chat_id, email
         FROM leads WHERE id = $1 AND deleted_at IS NULL`,
      [session.lead_id],
    )) as LeadRow | null;
  }

  const orders = lead ? await getPortalOrders(lead.id) : [];
  const deadlines = lead ? await getPortalDeadlines(lead.chat_id, lead.email) : [];

  return NextResponse.json({
    pin,
    clientName: session.client_name || lead?.first_name,
    service:    session.service || lead?.service || lead?.situation?.split("\n")[0],
    status:     lead?.status || session.status,
    urgency:    lead?.urgency,
    notes:      session.notes,
    createdAt:  session.created_at,
    accessedAt: new Date().toISOString(),
    orders: orders.map((o) => ({
      orderNumber:   o.order_number,
      service:       o.description,
      amount:        `${(o.amount_grosz / 100).toFixed(2)} ${o.currency}`,
      paymentStatus: clientFacingPaymentStatus(o.status),
      method:        o.method,
      date:          o.paid_at || o.created_at,
    })),
    deadlines: deadlines.map((d) => ({
      title: d.title,
      date:  d.target_date,
      type:  d.deadline_type,
    })),
  });
}
