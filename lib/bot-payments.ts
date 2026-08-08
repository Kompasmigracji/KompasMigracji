/* lib/bot-payments.ts — оплата всередині діалогу з ботом.
 *
 * Пункт 2 механізму, описаного партнером 04.08.2026: «бот доводить до оплати».
 * До цього бот доводив лише до посилання на сайт — клієнт виходив із розмови,
 * потрапляв на сторінку цін і там або платив, або губився.
 *
 * Тут клієнт не залишає чат: бот показує послуги з цінами, клієнт тисне
 * кнопку, бот реєструє транзакцію і повертає кнопку «Оплатити» просто в
 * діалог.
 *
 * Два правила, які тут не можна порушувати:
 *
 * 1. Ціна береться ВИКЛЮЧНО з lib/pricing-catalog.ts за serviceId. Той самий
 *    захист, що вже стоїть на /api/payment (комміт 947ebed0): клієнт ніколи
 *    не передає суму, тож підмінити її в callback_data неможливо.
 *
 * 2. session_id пишеться в ЙОГО лід — той, у якого вже є chat_id. Без цього
 *    /api/payment-notify не знайде, кому писати підтвердження в Telegram,
 *    і клієнт після оплати не отримає в чаті нічого.
 */

import { q, one } from "@/lib/db";
import { getServicePrice } from "@/lib/pricing-catalog";
import { registerTransaction, isP24Configured } from "@/lib/przelewy24";
import ukMessages from "@/messages/uk.json";

/** Послуги, які бот пропонує в чаті. Свідомо короткий список:
 *  повний прайс — 40+ позицій, у переписці це нечитабельно. Тут те, що
 *  найчастіше купують, решта лишається на сторінці цін. */
export const BOT_SERVICES: string[] = [
  "psvc_l12", // Консультація телефонічна
  "psvc_l13", // Консультація + узасаднення
  "psvc_n1",  // Разова довіреність
  "psvc_t1",  // Переклад документів
  "psvc_l1",  // Часовий побут
  "psvc_l3",  // Карта побуту (робота)
];

type Messages = Record<string, unknown>;

/** Назва послуги українською з messages/uk.json за тим самим serviceId. */
export function serviceName(serviceId: string): string {
  const flat = ukMessages as Messages;
  const stack: Messages[] = [flat];
  while (stack.length) {
    const node = stack.pop()!;
    for (const [key, value] of Object.entries(node)) {
      if (key === serviceId && typeof value === "string") return value;
      if (value && typeof value === "object") stack.push(value as Messages);
    }
  }
  return serviceId;
}

export function formatPln(grosz: number): string {
  return `${(grosz / 100).toFixed(2)} zł`;
}

/** Інлайн-клавіатура зі списком послуг. callback_data несе лише serviceId. */
export function buildServicesKeyboard() {
  const rows = BOT_SERVICES.map((id) => {
    const price = getServicePrice(id);
    return [{
      text: `${serviceName(id)} — ${price ? formatPln(price) : "за запитом"}`,
      callback_data: `pay_${id}`,
    }];
  });

  rows.push([{ text: "📋 Повний прайс на сайті", callback_data: "pay_full_price" }]);
  return { inline_keyboard: rows };
}

export interface BotPaymentResult {
  ok: boolean;
  /** Текст, який бот надсилає клієнту */
  text: string;
  /** Кнопка «Оплатити» — тільки при успіху */
  keyboard?: { inline_keyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>> };
}

/**
 * Реєструє транзакцію для послуги і повертає готове повідомлення з кнопкою.
 *
 * leadId — лід цього чату (у нього вже є chat_id), у нього ж пишеться
 * session_id, щоб payment-notify знайшов клієнта й написав йому після оплати.
 */
export async function startBotPayment(
  serviceId: string,
  leadId: string,
  firstName: string,
): Promise<BotPaymentResult> {
  const amount = getServicePrice(serviceId);
  if (amount === null) {
    return {
      ok: false,
      text:
        "Ця послуга не має фіксованої ціни — вартість залежить від справи.\n\n" +
        "Напишіть мені деталі, і менеджер порахує вартість особисто.",
    };
  }

  if (!isP24Configured()) {
    return {
      ok: false,
      text:
        "Онлайн-оплата тимчасово недоступна. Напишіть менеджеру — " +
        "він виставить рахунок вручну: +48 729 271 848",
    };
  }

  const name = serviceName(serviceId);
  const sessionId = `km-tg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kompasmigracji.com";

  const lead = (await one(
    `SELECT email, contact FROM leads WHERE id = $1`,
    [leadId],
  )) as { email: string | null; contact: string | null } | null;

  try {
    const { paymentUrl } = await registerTransaction({
      sessionId,
      amount,
      description: `${name} — Kompas Migracji`,
      email: lead?.email || "bot@kompasmigracji.com",
      language: "uk",
      urlReturn: `${siteUrl}/payment/success?session=${sessionId}`,
      urlStatus: `${siteUrl}/api/payment-notify`,
    });

    /* Прив'язуємо сесію до ЦЬОГО ліда — саме за нею payment-notify знайде
       chat_id і надішле клієнту підтвердження просто в діалог. */
    await q(
      `UPDATE leads
          SET session_id = $2,
              situation  = COALESCE(situation, $3),
              status     = CASE WHEN status = 'new' THEN 'in_progress' ELSE status END
        WHERE id = $1`,
      [leadId, sessionId, name],
    );

    return {
      ok: true,
      text:
        `<b>${name}</b>\n` +
        `Сума: <b>${formatPln(amount)}</b>\n\n` +
        `Натисніть кнопку нижче — відкриється захищена сторінка Przelewy24 ` +
        `(BLIK, картка, переказ).\n\n` +
        `Після оплати я напишу вам сюди підтвердження з номером замовлення, ` +
        `${firstName}.`,
      keyboard: {
        inline_keyboard: [
          [{ text: `💳 Оплатити ${formatPln(amount)}`, url: paymentUrl }],
          [{ text: "⬅️ Інші послуги", callback_data: "pay_menu" }],
        ],
      },
    };
  } catch (err) {
    console.error("[bot-payments] register failed:", err);
    return {
      ok: false,
      text:
        "Не вдалося створити платіж — технічна помилка на боці платіжного сервісу.\n\n" +
        "Напишіть менеджеру, він виставить рахунок вручну: +48 729 271 848",
    };
  }
}
