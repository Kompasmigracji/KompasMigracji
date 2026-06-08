/* /api/bot/webhook — Telegram Bot вебхук KompasCRM.

   Telegram надсилає сюди всі оновлення (messages + callback_queries).
   Зареєструйте URL через /api/bot/setup?secret=<TELEGRAM_SETUP_SECRET>.

   Потоки:
   ┌──────────────────────────────────────────────────────────────────────┐
   │ /start            → зберегти chat_id, надіслати кваліфікаційні кнопки │
   │ callback qual_*   → зберегти qualification, надіслати клуб + асистента│
   │ callback action_* → зв'язатися з живим асистентом (вимкнути бота)   │
   │ звичайний текст   → зберегти як situation, відповісти (якщо не mute) │
   └──────────────────────────────────────────────────────────────────────┘ */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { sendMessage, sendInlineKeyboard, answerCallback } from "@/lib/telegram";
import { createTaskFromLead } from "@/lib/task-from-lead";

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

/* ── Кнопки кваліфікації та меню ────────────────────────────────────── */
const START_BUTTONS = [
  [
    { text: "🏢 Праця",    callback_data: "qual_work" },
    { text: "💍 Шлюб",    callback_data: "qual_marriage" },
  ],
  [
    { text: "📚 Навчання", callback_data: "qual_study" },
    { text: "💼 Бізнес",  callback_data: "qual_business" },
  ],
  [
    { text: "👤 Зв'язатися з асистентом", callback_data: "action_call_human" }
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
    `SELECT id, status FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(chatId)],
  )) as { id: string; status: string } | null;

  if (existing) {
    await q(
      `UPDATE leads
          SET first_name = COALESCE($2, first_name),
              username   = COALESCE($3, username)
        WHERE chat_id = $1 AND deleted_at IS NULL`,
      [String(chatId), firstName, username],
    );
    return existing.id;
  }

  const row = (await one(
    `INSERT INTO leads (chat_id, source, first_name, username, status)
     VALUES ($1, 'bot', $2, $3, 'new')
     RETURNING id`,
    [String(chatId), firstName, username],
  )) as { id: string };

  await createTaskFromLead({
    name: firstName || "Користувач Telegram",
    contact: username ? `@${username}` : String(chatId),
    source: "bot",
  });
  return row.id;
}

/* ── Вебхук ─────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Перевірка секретного токена
  if (process.env.TELEGRAM_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let upd: TgUpdate;
  try {
    upd = (await req.json()) as TgUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = upd.callback_query?.message?.chat?.id ?? upd.callback_query?.from?.id ?? upd.message?.chat.id;
  if (!chatId) return NextResponse.json({ ok: true });

  // 1. Check if lead is muted (pending_manual status)
  const existingLead = (await one(
    `SELECT status FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(chatId)],
  )) as { status: string } | null;

  const isStartCommand = upd.message?.text?.trim().startsWith("/start");

  // If chat is muted, we ignore bot responses unless it's an explicit /start command to reset
  if (existingLead?.status === "pending_manual" && !isStartCommand) {
    // If it's a callback request to connect to assistant, answer to clear the spinner
    if (upd.callback_query) {
      await answerCallback(upd.callback_query.id, "Вже підключено до асистента");
    }
    return NextResponse.json({ ok: true });
  }

  /* ── Натискання inline-кнопки ─────────────────────────────────────── */
  if (upd.callback_query) {
    const cb   = upd.callback_query;
    const data = cb.data ?? "";

    if (QUAL_VALUE[data]) {
      const value = QUAL_VALUE[data];
      const label = QUAL_LABEL[data];

      await q(
        `UPDATE leads SET qualification = $1
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [value, String(chatId)],
      );

      await answerCallback(cb.id, `✅ ${label}`);

      // Community / Club Invitation block
      await sendInlineKeyboard(
        chatId,
        `✅ Дякуємо! Ваша категорія: <b>${label}</b>.\n\n` +
        `Разом з тим, запрошуємо тебе приєднатися до нашої <b>спільноти / клубу членів</b> Компасу Міграції!\n` +
        `Тут ми гуртуємося, щоб бути в курсі та допомагати один одному: ділимося локальними новинами ЄС, обговорюємо зміни в законах, публікуємо корисні гайди та перевірені вакансії. Ми не агенція працевлаштування — ми допомагаємо зорієнтуватися, легалізуватися та стати на ноги.\n\n` +
        `Наш координатор зв’яжеться з тобою найближчим часом. Якщо твоя справа термінова, ти завжди можеш покликати живого асистента:`,
        [
          [
            { text: "📢 Telegram-канал", url: "https://t.me/kompasmigracji" },
            { text: "📳 Viber-спільнота", url: "viber://chat?number=48729271848" }
          ],
          [
            { text: "👤 Зв'язатися з асистентом", callback_data: "action_call_human" }
          ]
        ]
      );
    } else if (data === "action_call_human") {
      // Set lead status to pending_manual to halt automated bot loops for this user
      await q(
        `UPDATE leads SET status = 'pending_manual'
          WHERE chat_id = $1 AND deleted_at IS NULL`,
        [String(chatId)],
      );

      const lead = (await one(
        `SELECT first_name, username, phone FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
        [String(chatId)],
      )) as { first_name?: string; username?: string; phone?: string } | null;

      // Create a task for live assistance
      await createTaskFromLead({
        name: lead?.first_name || "Користувач Telegram",
        contact: lead?.username ? `@${lead.username}` : (lead?.phone || String(chatId)),
        source: "bot_manual_request",
      });

      await answerCallback(cb.id, "✅ Запит надіслано");
      await sendMessage(
        chatId,
        `🔔 <b>Запит прийнято!</b> Бот-помічник призупинено для цього діалогу.\n\n` +
        `Наш живий асистент зв’яжеться з тобою найближчим часом.\n` +
        `Якщо виникло термінове питання — телефонуй або пиши в WhatsApp: <b>+48 729 271 848</b>`
      );
    } else {
      await answerCallback(cb.id);
    }
    return NextResponse.json({ ok: true });
  }

  /* ── Звичайне повідомлення ────────────────────────────────────────── */
  const msg = upd.message;
  if (!msg) return NextResponse.json({ ok: true });

  const from      = msg.from;
  const text      = (msg.text ?? "").trim();
  const username  = from?.username  ?? null;
  const firstName = from?.first_name ?? null;

  /* /start - Reset and begin chat flow */
  if (isStartCommand) {
    await getOrCreateLead(chatId, firstName, username);
    
    // Reset status back to 'new' if they had previously muted the bot, allowing interaction again
    await q(
      `UPDATE leads SET status = 'new'
        WHERE chat_id = $1 AND deleted_at IS NULL`,
      [String(chatId)],
    );

    const name = firstName ? `<b>${firstName}</b>` : "вас";
    await sendInlineKeyboard(
      chatId,
      `👋 Вітаємо, ${name}! Я — твій помічник у <b>Компасі Міграції</b>.\n\n` +
      `Ми допомагаємо українцям впевнено влаштуватися в Польщі, Іспанії та інших країнах ЄС — легально, прозоро та без жодної корупції.\n\n` +
      `Оберіть вашу ситуацію — це допоможе нам підготувати правильну інформацію:`,
      START_BUTTONS,
    );
    return NextResponse.json({ ok: true });
  }

  /* Текстове повідомлення */
  if (text) {
    await getOrCreateLead(chatId, firstName, username);
    await q(
      `UPDATE leads SET situation = $1
        WHERE chat_id = $2 AND deleted_at IS NULL`,
      [text, String(chatId)],
    );

    await sendInlineKeyboard(
      chatId,
      `✅ Повідомлення отримано!\n\n` +
      `Менеджер відповість найближчим часом. Також запрошуємо тебе приєднатися до нашої <b>спільноти / клубу членів</b>, де ми ділимося вакансіями та корисними гайдами.\n\n` +
      `Якщо виникло термінове питання або хочеш поспілкуватися безпосередньо, натисни кнопку нижче:`,
      [
        [
          { text: "📢 Telegram-канал", url: "https://t.me/kompasmigracji" },
          { text: "📳 Viber-спільнота", url: "viber://chat?number=48729271848" }
        ],
        [
          { text: "👤 Зв'язатися з асистентом", callback_data: "action_call_human" }
        ]
      ]
    );
  }

  return NextResponse.json({ ok: true });
}
