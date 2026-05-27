/* /api/bot/webhook — Telegram Bot вебхук KompasCRM.

   Telegram надсилає сюди всі оновлення (messages + callback_queries).
   Зареєструйте URL через /api/bot/setup?secret=<TELEGRAM_SETUP_SECRET>.

   Потоки:
   ┌──────────────────────────────────────────────────────────────────────┐
   │ /start            → зберегти chat_id, надіслати кваліфікаційні кнопки │
   │ callback qual_*   → зберегти qualification, надіслати підтвердження   │
   │ звичайне текст    → зберегти як situation, відповісти «отримано»       │
   └──────────────────────────────────────────────────────────────────────┘ */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { sendMessage, sendInlineKeyboard, answerCallback } from "@/lib/telegram";

/* ── Telegram types (мiнiмальний набiр) ────────────────────────────── */
interface TgUser { id: number; username?: string; first_name?: string }
interface TgChat { id: number }
interface TgMessage { chat: TgChat; from?: TgUser; text?: string }
interface TgCallbackQuery {
  id: string;
  data?: string;
  from?: TgUser;
  message?: { chat?: TgChat };
}
interface TgUpdate {
  callback_query?: TgCallbackQuery;
  message?: TgMessage;
}

/* ── Кнопки кваліфікації ────────────────────────────────────────────── */
const QUAL_BUTTONS = [
  [
    { text: "🏢 Праця",    callback_data: "qual_work" },
    { text: "💍 Шлюб",    callback_data: "qual_marriage" },
  ],
  [
    { text: "📚 Навчання", callback_data: "qual_study" },
    { text: "💼 Бізнес",  callback_data: "qual_business" },
  ],
];

const QUAL_VALUE: Record<string, string> = {
  qual_work:     "work",
  qual_marriage: "marriage",
  qual_study:    "study",
  qual_business: "business",
};

const QUAL_LABEL: Record<string, string> = {
  qual_work:     "Праця",
  qual_marriage: "Шлюб",
  qual_study:    "Навчання",
  qual_business: "Бізнес",
};

/* ── Допоміжні функції ──────────────────────────────────────────────── */
async function getOrCreateLead(
  chatId: number,
  firstName: string | null,
  username: string | null,
): Promise<string> {
  const existing = (await one(
    `SELECT id FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [chatId],
  )) as { id: string } | null;
  if (existing) {
    await q(
      `UPDATE leads
          SET first_name = COALESCE($2, first_name),
              username   = COALESCE($3, username)
        WHERE chat_id = $1 AND deleted_at IS NULL`,
      [chatId, firstName, username],
    );
    return existing.id;
  }

  const row = (await one(
    `INSERT INTO leads (chat_id, source, first_name, username, status)
     VALUES ($1, 'bot', $2, $3, 'new')
     RETURNING id`,
    [chatId, firstName, username],
  )) as { id: string };
  return row.id;
}

/* ── Вебхук ─────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Перевірка секретного токена (якщо заданий)
  if (process.env.TELEGRAM_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let upd: TgUpdate;
  try { upd = (await req.json()) as TgUpdate; } catch { return NextResponse.json({ ok: true }); }

  /* ── Натискання inline-кнопки ─────────────────────────────────────── */
  if (upd.callback_query) {
    const cb     = upd.callback_query;
    const data   = cb.data ?? "";
    const chatId = cb.message?.chat?.id ?? cb.from?.id;

    if (chatId && QUAL_VALUE[data]) {
      const value = QUAL_VALUE[data];
      const label = QUAL_LABEL[data];

      await q(
        `UPDATE leads SET qualification = $1
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [value, chatId],
      );

      await answerCallback(cb.id, `✅ ${label}`);
      await sendMessage(
        chatId,
        `✅ Дякуємо! Ваша категорія: <b>${label}</b>.\n\n` +
        `Наш менеджер зв’яжеться з вами найближчим часом.\n` +
        `Якщо терміново — телефонуйте: <b>+48 729 271 848</b>`,
      );
    } else {
      await answerCallback(cb.id);
    }
    return NextResponse.json({ ok: true });
  }

  /* ── Звичайне повідомлення ────────────────────────────────────────── */
  const msg = upd.message;
  if (!msg) return NextResponse.json({ ok: true });

  const chatId    = msg.chat.id;
  const from      = msg.from;
  const text      = (msg.text ?? "").trim();
  const username  = from?.username  ?? null;
  const firstName = from?.first_name ?? null;

  /* /start */
  if (text.startsWith("/start")) {
    await getOrCreateLead(chatId, firstName, username);

    const name = firstName ? `<b>${firstName}</b>` : "вас";
    await sendInlineKeyboard(
      chatId,
      `👋 Вітаємо, ${name}! Це бот <b>KompasMigracji</b>.\n\n` +
      `Оберіть вашу ситуацію — це допоможе нам підготувати правильну інформацію:`,
      QUAL_BUTTONS,
    );
    return NextResponse.json({ ok: true });
  }

  /* Текстове повідомлення */
  if (text) {
    await getOrCreateLead(chatId, firstName, username);
    await q(
      `UPDATE leads SET situation = $1
        WHERE chat_id = $2 AND deleted_at IS NULL`,
      [text, chatId],
    );
    await sendMessage(
      chatId,
      `✅ Повідомлення отримано!\n\n` +
      `Менеджер відповість найближчим часом. Якщо не відповіли протягом 24 год — ` +
      `зателефонуйте: <b>+48 729 271 848</b>`,
    );
  }

  return NextResponse.json({ ok: true });
}
