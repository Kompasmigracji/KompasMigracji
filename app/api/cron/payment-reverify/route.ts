export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* /api/cron/payment-reverify — добиває платежі, які застрягли непідтвердженими.
 *
 * Коли P24 віддає 401 на transaction/verify, гроші клієнта вже списані, а ми
 * не маємо підтвердження. Полагодження ключа само по собі ті платежі не
 * підтвердить: P24 ретраїть нотифікацію обмежену кількість разів і зупиняється.
 * Цей крон повертається до них сам — щойно доступ відновлять, зависла оплата
 * дозаписується без ручного втручання й без повторної оплати клієнтом.
 *
 * Викликається з /api/cron/daily-ops (проєкт на Hobby-плані, де ліміт
 * cron-записів у vercel.json уже одного разу ламав деплой), або вручну
 * адміном через POST. */
import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { verifyTransaction } from "@/lib/przelewy24";
import { markPaymentPaid, markPaymentVerifyFailed, formatAmount } from "@/lib/payments";
import { sendMessage } from "@/lib/telegram";

/* Після 12 невдалих спроб перестаємо смикати P24 і чекаємо на людину —
   далі це вже не збій зв'язку, а неправильна конфігурація. */
const MAX_ATTEMPTS = 12;

export async function runPaymentReverify() {
  const stuck = await q(
    `SELECT session_id, order_number, p24_order_id, amount_grosz, currency
       FROM kompas_payments
      WHERE status IN ('pending','verify_failed')
        AND provider = 'przelewy24'
        AND p24_order_id IS NOT NULL
        AND verify_attempts < $1
        AND created_at > now() - interval '30 days'
      ORDER BY created_at ASC
      LIMIT 25`,
    [MAX_ATTEMPTS],
  );

  let recovered = 0;
  const stillFailing: string[] = [];

  for (const p of stuck as any[]) {
    const res = await verifyTransaction({
      sessionId: p.session_id,
      orderId:   Number(p.p24_order_id),
      amount:    p.amount_grosz,
      currency:  p.currency,
    });

    if (res.ok) {
      await markPaymentPaid(p.session_id);
      await q(
        `UPDATE leads SET paid_at = COALESCE(paid_at, now()), status = 'closed'
          WHERE session_id = $1 AND deleted_at IS NULL`,
        [p.session_id],
      );
      recovered++;
    } else {
      await markPaymentVerifyFailed(p.session_id, `HTTP ${res.status}: ${res.body}`);
      stillFailing.push(`${p.order_number} — ${formatAmount(p.amount_grosz, p.currency)}`);
    }
  }

  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChat && (recovered > 0 || stillFailing.length > 0)) {
    const lines = [
      recovered > 0 ? `✅ Дозаписано оплат: ${recovered}` : "",
      stillFailing.length
        ? `⚠️ Досі без підтвердження (${stillFailing.length}):\n${stillFailing.slice(0, 10).join("\n")}`
        : "",
    ].filter(Boolean).join("\n\n");
    try {
      await sendMessage(adminChat, `🔁 <b>Переперевірка платежів</b>\n\n${lines}`);
    } catch { /* non-blocking */ }
  }

  return { checked: (stuck as any[]).length, recovered, stillFailing: stillFailing.length };
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get("authorization") === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await runPaymentReverify());
}

/* Ручний запуск з адмінки — щоб не чекати добу після полагодження ключа. */
export async function POST() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json(await runPaymentReverify());
}
