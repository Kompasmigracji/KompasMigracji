export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* GET /api/payment/status?session=xxx
 *
 * Публічний ендпоінт для сторінки /payment/success.
 *
 * Раніше дивився лише на leads.paid_at і повертав рівно два стани: paid або
 * pending. Через це 07.08.2026 клієнт, який реально заплатив 250 zł, побачив
 * «Оплату ще не підтверджено» і кнопку «Спробувати ще раз»: verify впав з 401,
 * paid_at лишився NULL, і сторінка чесно відзвітувала «pending» — тобто
 * запросила другу оплату за вже оплачену послугу.
 *
 * Тепер джерелом правди є kompas_payments, де факт надходження грошей
 * записаний ще до будь-яких перевірок. З'являється третій стан — received:
 * гроші прийшли, підтвердження провайдера немає. Клієнту в цьому стані треба
 * казати «оплату отримано, менеджер зв'яжеться», а не «спробуйте ще раз». */

import { NextRequest, NextResponse } from "next/server";
import { one } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  try {
    const payment = (await one(
      `SELECT status, order_number, paid_at
         FROM kompas_payments
        WHERE session_id = $1
        LIMIT 1`,
      [sessionId],
    )) as { status: string; order_number: string; paid_at: string | null } | null;

    if (payment) {
      if (payment.status === "paid") {
        return NextResponse.json({ status: "paid", orderNumber: payment.order_number });
      }
      if (payment.status === "verify_failed" || payment.status === "pending") {
        /* Нотифікація від провайдера прийшла — отже, гроші пішли.
           Не пропонуємо платити повторно. */
        return NextResponse.json({ status: "received", orderNumber: payment.order_number });
      }
      return NextResponse.json({ status: payment.status, orderNumber: payment.order_number });
    }

    /* Запису про платіж немає — можливо, вебхук ще в дорозі. Резервно
       дивимося на лід, як робила попередня версія. */
    const lead = (await one(
      `SELECT paid_at FROM leads WHERE session_id = $1 AND deleted_at IS NULL LIMIT 1`,
      [sessionId],
    )) as { paid_at: string | null } | null;

    if (!lead) return NextResponse.json({ status: "unknown" });
    return NextResponse.json({ status: lead.paid_at ? "paid" : "pending" });
  } catch (err) {
    console.error("payment/status error:", err);
    return NextResponse.json({ status: "unknown" });
  }
}
