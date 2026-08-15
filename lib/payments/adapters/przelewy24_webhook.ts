export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* /api/payment-notify — Przelewy24 IPN webhook.
 *
 * Порядок дій тут навмисний і важливіший за будь-яку іншу деталь у файлі:
 *
 *   1. записати нотифікацію в kompas_payments   ← ПЕРШИМ, до перевірок
 *   2. верифікувати транзакцію в P24
 *   3. якщо ok   → позначити оплату, лід, листи клієнту й менеджеру
 *      якщо ні   → позначити verify_failed і КРИКНУТИ адміну
 *
 * Чому саме так. 07.08.2026 клієнт оплатив 250 zł через BLIK. P24 списав
 * гроші й надіслав нотифікацію. Виклик transaction/verify повернув
 * 401 Incorrect authentication, і роут вийшов з 502 у рядку, який стояв ДО
 * будь-якого запису в базу. Результат: leads.paid_at лишився NULL, у CRM
 * порожньо, сторінка /payment/success показала клієнту «Оплату ще не
 * підтверджено» з кнопкою «Спробувати ще раз», а єдиним доказом платежу
 * був лист від Przelewy24 на спільну пошту.
 *
 * Верифікація може падати з причин, які від нас не залежать: протермінований
 * ключ, IP поза білим списком, аварія на боці P24. Жодна з них не є підставою
 * втратити факт оплати. */
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { one } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { notifyAdmin } from "@/lib/telegram";
import { renderTemplate } from "@/lib/template-render";
import { markLeadPaid } from "@/lib/lead-payment-sync";
import { issuePortalPin } from "@/lib/portal";
import {
  verifyTransaction,
  isP24Configured,
  verifyNotificationSign,
  looksLikeP24Ip,
} from "@/lib/przelewy24";
import {
  recordNotify,
  markPaymentPaid,
  markPaymentVerifyFailed,
  formatAmount,
} from "@/lib/payments";
import {
  sendEmail,
  paymentReceiptEmailHtml,
  newPaidOrderEmailHtml,
  paymentVerifyFailedEmailHtml,
} from "@/lib/email";


const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.kompasmigracji.com").replace(/\/$/, "");
const MANAGER_EMAIL =
  process.env.MANAGER_EMAIL || process.env.ADMIN_EMAIL || "kompas.migracji@gmail.com";

/** Сповіщення команди, яке не має права впасти й забрати з собою платіж. */
async function alertTeam(html: string): Promise<void> {
  await notifyAdmin(html);
}

export async function POST(req: NextRequest) {
  if (!isP24Configured()) {
    const err = new Error("payment-notify: P24 not configured");
    console.error(err.message);
    Sentry.captureException(err);
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = String(body.sessionId ?? "");
  const orderId   = Number(body.orderId ?? 0);
  const amount    = Number(body.amount ?? 0);
  const currency  = String(body.currency ?? "PLN");
  const methodId  = body.methodId != null ? String(body.methodId) : null;

  if (!sessionId || !orderId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Malformed notification" }, { status: 400 });
  }

  /* ── 0. Автентичність нотифікації ──────────────────────────────────────
     Перевірка стоїть перед записом, бо запис тепер робиться беззастережно:
     без неї будь-хто, хто вгадає session_id, створив би рядок у
     kompas_payments і підняв команду по тривозі. Раніше від підробок
     захищав сам виклик verify — тепер захист має спрацювати раніше.

     Це локальний підрахунок SHA-384 від CRC: він не залежить від
     доступності P24 і тому не може заблокувати реальну оплату. */
  if (!verifyNotificationSign(body)) {
    const ip = req.headers.get("x-forwarded-for");
    console.warn(
      `payment-notify: rejected notification with invalid sign (session=${sessionId}, ip=${ip ?? "?"})`,
    );
    /* Sentry — так, алерт у месенджер — ні: сканери стукають регулярно,
       і команду не можна привчати ігнорувати сповіщення про платежі. */
    Sentry.captureMessage(`payment-notify: invalid sign for session ${sessionId}`, "warning");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  /* М'яка перевірка джерела — лише для логів. Рішення вже ухвалив підпис,
     а x-forwarded-for за проксі не є доказом. */
  if (!looksLikeP24Ip(req.headers.get("x-forwarded-for"))) {
    console.info(
      `payment-notify: valid sign from unexpected IP ${req.headers.get("x-forwarded-for") ?? "?"}`,
    );
  }

  /* ── 1. Запис нотифікації. До верифікації, завжди. ─────────────────── */
  let payment;
  try {
    payment = await recordNotify({
      provider:    "przelewy24",
      sessionId,
      p24OrderId:  orderId,
      method:      methodId,
      amountGrosz: amount,
      currency,
      raw:         body,
    });
  } catch (err) {
    /* База недоступна — лишаємо слід бодай у Sentry й месенджері,
       інакше платіж зникне безслідно. */
    console.error("payment-notify: failed to record notification", err);
    Sentry.captureException(err);
    await alertTeam(
      `🆘 <b>Оплата надійшла, але НЕ ЗАПИСАЛАСЯ в базу</b>\n` +
      `Session: <code>${sessionId}</code>\nP24 orderId: ${orderId}\n` +
      `Сума: ${formatAmount(amount, currency)}\n` +
      `Звір транзакцію в панелі P24 вручну.`,
    );
    /* 500 → P24 повторить нотифікацію пізніше. */
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }

  /* ── 2. Верифікація ────────────────────────────────────────────────── */
  const verification = await verifyTransaction({ sessionId, orderId, amount, currency });

  if (!verification.ok) {
    const detail = `HTTP ${verification.status}: ${verification.body}`;
    console.error("P24 verify failed:", detail);
    Sentry.captureException(new Error(`P24 verify failed: ${detail}`));

    await markPaymentVerifyFailed(sessionId, detail);

    await alertTeam(
      `⚠️ <b>Платіж не підтверджено провайдером</b>\n` +
      `Замовлення: <b>${payment.order_number}</b>\n` +
      `Сума: ${formatAmount(amount, currency)}\n` +
      `Session: <code>${sessionId}</code>\n\n` +
      `Гроші з клієнта, найімовірніше, вже списані. Звір транзакцію в панелі P24 ` +
      `і НЕ проси клієнта платити повторно.\n\n${detail}`,
    );

    void sendEmail(
      MANAGER_EMAIL,
      `⚠️ Платіж ${payment.order_number} не підтверджено — потрібна ручна звірка`,
      paymentVerifyFailedEmailHtml({
        orderNumber: payment.order_number,
        sessionId,
        amount: formatAmount(amount, currency),
        error: detail,
      }),
      "payment_verify_failed",
    );

    /* 502 → P24 повторить нотифікацію; /api/cron/payment-reverify теж
       підбере цей рядок, коли доступ полагодять. */
    return NextResponse.json({ error: "Verification failed" }, { status: 502 });
  }

  /* ── 3. Фіксація оплати (ідемпотентно) ─────────────────────────────── */
  const newlyPaid = await markPaymentPaid(sessionId);
  if (!newlyPaid) {
    return NextResponse.json({ status: "ok", duplicate: true });
  }

  /* ── 4. Лід ────────────────────────────────────────────────────────── */
  type LeadRow = {
    id: string;
    chat_id: number | null;
    first_name: string | null;
    service: string | null;
    contact: string | null;
    situation: string | null;
    email: string | null;
  };

  let lead: LeadRow | null = null;
  try {
    lead = (await one(
      `SELECT id, chat_id, first_name, service, contact, situation, email
         FROM leads
        WHERE session_id = $1 AND deleted_at IS NULL
        LIMIT 1`,
      [sessionId],
    )) as LeadRow | null;
  } catch (err) {
    console.warn("payment-notify: lead lookup failed", err);
  }

  if (lead) await markLeadPaid(lead.id);

  /* ── 4a. Доступ до порталу ─────────────────────────────────────────
     PIN видається саме тут, у мить підтвердження оплати. Портал, доступ до
     якого треба комусь не забути видати вручну, залишається порожнім — це
     вже перевірено: kompas_portal_sessions пролежала з нулем рядків увесь
     час свого існування. Клієнт, який щойно заплатив, має отримати доступ
     не питаючи. */
  let portalPin: string | null = null;
  if (lead) {
    try {
      const session = await issuePortalPin(lead.id, {
        clientName: lead.first_name,
        service:    lead.situation?.split("\n")[0] || lead.service,
      });
      portalPin = session.pin;
    } catch (err) {
      /* Портал — приємний бонус, а не умова зарахування оплати. */
      console.error("payment-notify: portal pin issue failed", err);
    }
  }

  const serviceLabel =
    payment.description ?? lead?.situation?.split("\n")[0] ?? lead?.service ?? "Послуга";
  const amountLabel = formatAmount(amount, currency);
  const clientEmail = payment.customer_email ?? lead?.email ?? null;
  const clientName  = payment.customer_name  ?? lead?.first_name ?? null;
  const clientPhone = payment.customer_phone ?? lead?.contact ?? null;

  /* ── 5. Лист клієнту ───────────────────────────────────────────────── */
  if (clientEmail) {
    void sendEmail(
      clientEmail,
      `Оплата отримана — замовлення ${payment.order_number}`,
      paymentReceiptEmailHtml({
        name:        clientName,
        orderNumber: payment.order_number,
        service:     serviceLabel,
        amount:      amountLabel,
        method:      payment.method,
        portalPin,
      }),
      "payment_receipt",
    );
  }

  /* ── 6. Лист менеджеру ─────────────────────────────────────────────── */
  void sendEmail(
    MANAGER_EMAIL,
    `🔔 Нове оплачене замовлення ${payment.order_number} — ${amountLabel}`,
    newPaidOrderEmailHtml({
      orderNumber: payment.order_number,
      service:     serviceLabel,
      amount:      amountLabel,
      name:        clientName,
      phone:       clientPhone,
      email:       clientEmail,
      messenger:   payment.messenger,
      method:      payment.method,
      paidAt:      new Date().toLocaleString("uk-UA", { timeZone: "Europe/Warsaw" }),
    }),
    "new_paid_order",
  );

  /* ── 7. Авто-повідомлення клієнту в Telegram ───────────────────────── */
  if (lead?.chat_id) {
    try {
      const tpl = (await one(
        `SELECT body FROM message_templates
          WHERE category = 'payment' AND auto_send = true
          ORDER BY sort_order ASC LIMIT 1`,
      )) as { body: string } | null;

      const text = tpl
        ? renderTemplate(tpl.body, {
            name:    lead.first_name ?? "клієнте",
            service: lead.service ?? "",
            contact: "+48 729 271 848",
          })
        : `✅ <b>Оплату підтверджено!</b>\n\nЗамовлення <b>${payment.order_number}</b>.\n` +
          `Дякуємо за довіру. Ваш менеджер зв'яжеться з вами найближчим часом.`;

      const withPortal = portalPin
        ? `${text}\n\n🔐 Стежити за справою: ${SITE_URL}/portal\nВаш PIN: <b>${portalPin}</b>`
        : text;

      await sendMessage(lead.chat_id, withPortal);
    } catch (err) {
      console.error("payment-notify: Telegram send failed", err);
    }
  }

  /* ── 8. Сповіщення команди ─────────────────────────────────────────── */
  await alertTeam(
    `💳 <b>Нова оплата!</b>\n` +
    `Замовлення: <b>${payment.order_number}</b>\n` +
    `👤 Клієнт: ${clientName ?? "—"}\n` +
    (clientPhone ? `📞 Телефон: ${clientPhone}\n` : "") +
    `📝 Послуга: ${serviceLabel}\n` +
    `💰 Сума: ${amountLabel}\n` +
    (lead ? "" : "⚠️ Лід за цією сесією не знайдено — картку завести вручну\n") +
    `🔑 Session: <code>${sessionId}</code>`,
  );

  return NextResponse.json({ status: "ok", orderNumber: payment.order_number });
}
