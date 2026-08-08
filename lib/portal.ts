/* lib/portal.ts — доступ клієнта до власної справи.
 *
 * Портал існував і до цього: `/portal`, `/portal/case/[pin]`,
 * `kompas_portal_sessions`, авторизація за PIN з rate-limit і lockout.
 * Не працювало нічого з цього, і причин було рівно дві:
 *
 *   1. POST /api/portal/case робив `Number(body.leadId)`, а leads.id — uuid.
 *      Number(uuid) = NaN, і роут завжди відповідав 400. PIN не міг бути
 *      створений жодного разу — у kompas_portal_sessions 0 рядків.
 *   2. /admin/client-portal, звідки менеджер мав його видавати, був макетом:
 *      `const [portals] = useState([])`, жодного fetch.
 *
 * Тому тут не тільки виправлення, а й автовидача: PIN з'являється сам у мить
 * підтвердження оплати. Портал, доступ до якого треба комусь не забути
 * видати вручну, залишиться порожнім — це вже перевірено на практиці.
 */

import { q, one } from "@/lib/db";
import { randomBytes } from "crypto";

export interface PortalSession {
  pin: string;
  /** true, якщо PIN уже існував і ми повернули наявний */
  existed: boolean;
}

/** PIN виду 3F9A2C — 6 hex-символів, зручно диктувати телефоном. */
function generatePin(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

/**
 * Видає (або повертає наявний) PIN для ліда.
 *
 * leadId — uuid. Саме тут ламався попередній код: приведення до Number
 * перетворювало uuid на NaN.
 */
export async function issuePortalPin(
  leadId: string,
  opts: { clientName?: string | null; service?: string | null; notes?: string } = {},
): Promise<PortalSession> {
  const existing = (await one(
    "SELECT pin FROM kompas_portal_sessions WHERE lead_id = $1",
    [leadId],
  )) as { pin: string } | null;

  if (existing) return { pin: existing.pin, existed: true };

  let pin = generatePin();
  for (let i = 0; i < 5; i++) {
    const clash = await one("SELECT id FROM kompas_portal_sessions WHERE pin = $1", [pin]);
    if (!clash) break;
    pin = generatePin();
  }

  await q(
    `INSERT INTO kompas_portal_sessions (pin, lead_id, client_name, service, notes, pin_sent_at)
     VALUES ($1, $2, $3, $4, $5, now())`,
    [pin, leadId, opts.clientName || "Клієнт", opts.service || null, opts.notes || ""],
  );

  return { pin, existed: false };
}

export interface PortalOrder {
  order_number: string;
  status: string;
  amount_grosz: number;
  currency: string;
  description: string | null;
  method: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface PortalDeadline {
  title: string;
  target_date: string;
  deadline_type: string | null;
}

/**
 * Замовлення клієнта для порталу.
 *
 * Показуємо ТІЛЬКИ те, що стосується його ліда — вибірка жорстко обмежена
 * lead_uuid, без жодного параметра з боку клієнта, окрім самого PIN.
 *
 * verify_failed свідомо показується як «оплата отримана»: для клієнта гроші
 * пішли, а те, що провайдер нам цього не підтвердив, — наша внутрішня
 * проблема, а не привід натякати людині, що вона не заплатила.
 */
export async function getPortalOrders(leadId: string): Promise<PortalOrder[]> {
  return (await q(
    `SELECT order_number, status, amount_grosz, currency, description,
            method, paid_at, created_at
       FROM kompas_payments
      WHERE lead_uuid = $1
      ORDER BY created_at DESC
      LIMIT 20`,
    [leadId],
  )) as PortalOrder[];
}

/**
 * Терміни клієнта — те, що йому справді треба не проґавити.
 *
 * kompas_deadlines не має lead_id: терміни реєструє сам клієнт командою
 * /termin у Telegram, тож рядок прив'язаний до telegram_chat_id (або до
 * пошти, якщо термін заводив менеджер). Зіставляємо саме за цими полями —
 * лід тут ні до чого.
 */
export async function getPortalDeadlines(
  chatId: number | string | null,
  email: string | null,
): Promise<PortalDeadline[]> {
  if (!chatId && !email) return [];

  return (await q(
    `SELECT title, target_date, deadline_type::text AS deadline_type
       FROM kompas_deadlines
      WHERE status <> 'cancelled'
        AND target_date >= current_date
        AND (($1::bigint IS NOT NULL AND telegram_chat_id = $1::bigint)
          OR ($2::text   IS NOT NULL AND contact_email    = $2::text))
      ORDER BY target_date ASC
      LIMIT 10`,
    [chatId ? String(chatId) : null, email],
  )) as PortalDeadline[];
}

/** Статус оплати для клієнта: одне слово замість шести внутрішніх станів. */
export function clientFacingPaymentStatus(status: string): "paid" | "received" | "unpaid" {
  if (status === "paid") return "paid";
  if (status === "verify_failed" || status === "pending" || status === "notified") return "received";
  return "unpaid";
}
