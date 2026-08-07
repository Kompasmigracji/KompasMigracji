/* lib/payments.ts — єдине місце, де платіж стає рядком у базі.
 *
 * Правило, з якого все випливає: гроші списуються на боці банку, а не в нас.
 * До моменту, коли ми щось перевіряємо, клієнт уже заплатив. Тому нотифікація
 * записується ПЕРШОЮ дією, до будь-якої верифікації, і не зникає, навіть якщо
 * verify впаде, Telegram промовчить, а Resend поверне помилку.
 *
 * Саме цього бракувало 07.08.2026: verify віддав 401, роут вийшов з 502 і
 * платіж на 250 zł не лишив у базі жодного сліду. */

import { q, one } from "@/lib/db";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "verify_failed"
  | "failed"
  | "refunded"
  | "cancelled";

export interface NotifyRecord {
  provider: string;
  sessionId: string;
  amountGrosz: number;
  currency: string;
  p24OrderId?: number | null;
  method?: string | null;
  raw: unknown;
}

export interface PaymentRow {
  id: string;
  order_number: string;
  session_id: string;
  status: PaymentStatus;
  amount_grosz: number;
  currency: string;
  description: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  messenger: string | null;
  service_slug: string | null;
  lead_uuid: string | null;
  paid_at: string | null;
}

/** KM-000001, KM-000002 … — формат, який шеф просив у листах. */
export async function nextOrderNumber(): Promise<string> {
  const row = (await one(
    `SELECT 'KM-' || lpad(nextval('kompas_order_number_seq')::text, 6, '0') AS n`,
  )) as { n: string } | null;
  /* Послідовність могла не існувати на старій базі — не валимо платіж через
     косметику номера, а даємо детермінований fallback за часом. */
  return row?.n ?? `KM-T${Date.now().toString().slice(-9)}`;
}

/**
 * Записує нотифікацію провайдера. Ідемпотентна за session_id: повторна
 * доставка того самого вебхука (P24 і Stripe шлють ретраї) оновлює рядок,
 * а не створює другий і не видає другий номер замовлення.
 */
export async function recordNotify(input: NotifyRecord): Promise<PaymentRow> {
  const existing = (await one(
    `SELECT * FROM kompas_payments WHERE session_id = $1`,
    [input.sessionId],
  )) as PaymentRow | null;

  if (existing) {
    /* Повторна доставка того самого вебхука: оновлюємо тіло нотифікації й
       реквізити провайдера, але НЕ чіпаємо status, paid_at і order_number —
       номер замовлення видається один раз і живе в листі клієнта. */
    const updated = (await one(
      `UPDATE kompas_payments
          SET p24_order_id = COALESCE($2, p24_order_id),
              method       = COALESCE($3, method),
              raw_notify   = $4,
              notified_at  = COALESCE(notified_at, now())
        WHERE session_id = $1
        RETURNING *`,
      [input.sessionId, input.p24OrderId ?? null, input.method ?? null, JSON.stringify(input.raw)],
    )) as PaymentRow | null;

    return updated ?? existing;
  }

  /* Рядка ще немає — платіж прийшов на session, якого ми не створювали
     (ручне посилання, старий лінк, оплата після редеплою). Однаково
     записуємо: невпізнаний платіж має бути видимим, а не втраченим. */
  const lead = (await one(
    `SELECT id, first_name, contact, email, situation
       FROM leads WHERE session_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [input.sessionId],
  )) as {
    id: string;
    first_name: string | null;
    contact: string | null;
    email: string | null;
    situation: string | null;
  } | null;

  const orderNumber = await nextOrderNumber();
  const description = lead?.situation?.split("\n")[0] ?? null;

  const row = (await one(
    `INSERT INTO kompas_payments
       (order_number, session_id, p24_order_id, provider, method, amount_grosz,
        currency, description, status, lead_uuid, customer_name, customer_email,
        customer_phone, raw_notify, notified_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',$9,$10,$11,$12,$13,now())
     RETURNING *`,
    [
      orderNumber,
      input.sessionId,
      input.p24OrderId ?? null,
      input.provider,
      input.method ?? null,
      input.amountGrosz,
      input.currency,
      description,
      lead?.id ?? null,
      lead?.first_name ?? null,
      lead?.email ?? null,
      lead?.contact ?? null,
      JSON.stringify(input.raw),
    ],
  )) as PaymentRow;

  return row;
}

/** Верифікація пройшла — фіксуємо оплату. Повертає false, якщо вже було paid. */
export async function markPaymentPaid(sessionId: string): Promise<boolean> {
  const row = (await one(
    `UPDATE kompas_payments
        SET status = 'paid',
            paid_at = COALESCE(paid_at, now()),
            verify_error = NULL,
            last_verify_at = now(),
            verify_attempts = verify_attempts + 1
      WHERE session_id = $1 AND status <> 'paid'
      RETURNING id`,
    [sessionId],
  )) as { id: string } | null;

  return !!row;
}

/**
 * Верифікація не пройшла. Це НЕ означає, що грошей немає — це означає, що ми
 * не змогли їх підтвердити. Статус окремий саме тому: платіж лишається
 * видимим у панелі з червоним прапорцем і його підбирає /api/cron/payment-reverify.
 */
export async function markPaymentVerifyFailed(
  sessionId: string,
  error: string,
): Promise<void> {
  await q(
    `UPDATE kompas_payments
        SET status = CASE WHEN status = 'paid' THEN 'paid' ELSE 'verify_failed' END,
            verify_error = $2,
            last_verify_at = now(),
            verify_attempts = verify_attempts + 1
      WHERE session_id = $1`,
    [sessionId, error.slice(0, 2000)],
  );
}

export function formatAmount(grosz: number, currency = "PLN"): string {
  return `${(grosz / 100).toFixed(2)} ${currency}`;
}
