export const dynamic = "force-dynamic";
/* /api/bot/webhook — Telegram Bot вебхук KompasCRM.
   Реалізація багатокрокової воронки лідів (Lead Funnel)
   Кроки:
   1. /start -> Вибір мети (qualification)
   2. Вибір країни (country)
   3. Вибір терміновості (urgency)
   4. Вибір пакета послуг (service)
   5. Фінал -> Запрошення в клуби + Асистент
*/
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { sendMessage, sendInlineKeyboard, answerCallback } from "@/lib/telegram";
import { createTaskFromLead } from "@/lib/task-from-lead";
import { sendGreeting, sendClarification, sendCommunityInvitation } from "@/lib/orakul-bot";

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

const STEP_1_BUTTONS = [
  [
    { text: "🏢 Праця", callback_data: "funnel_qual_work" },
    { text: "💍 Шлюб", callback_data: "funnel_qual_marriage" }
  ],
  [
    { text: "📚 Навчання", callback_data: "funnel_qual_study" },
    { text: "💼 Бізнес", callback_data: "funnel_qual_business" }
  ],
  [
    { text: "👤 Покликати асистента", callback_data: "action_call_human" }
  ]
];

const STEP_2_BUTTONS = [
  [
    { text: "🇵🇱 Польща", callback_data: "funnel_country_pl" },
    { text: "🇪🇸 Іспанія", callback_data: "funnel_country_es" }
  ],
  [
    { text: "🇩🇪 Німеччина", callback_data: "funnel_country_de" },
    { text: "🇨🇿 Чехія", callback_data: "funnel_country_cz" }
  ]
];

const STEP_3_BUTTONS = [
  [
    { text: "⚡ Терміново (<1 міс)", callback_data: "funnel_urg_high" },
    { text: "📅 1-3 місяці", callback_data: "funnel_urg_med" }
  ],
  [
    { text: "🔍 Тільки планую", callback_data: "funnel_urg_low" }
  ]
];

const STEP_4_BUTTONS = [
  [
    { text: "🟢 Basic (Консультація)", callback_data: "funnel_srv_basic" },
    { text: "🟡 Standard (Супровід)", callback_data: "funnel_srv_standard" }
  ],
  [
    { text: "🔴 Premium (Під ключ)", callback_data: "funnel_srv_premium" }
  ]
];

const QUAL_LABELS: Record<string, string> = {
  work: "🏢 Праця",
  marriage: "💍 Шлюб",
  study: "📚 Навчання",
  business: "💼 Бізнес"
};

const COUNTRY_LABELS: Record<string, string> = {
  pl: "Польща",
  es: "Іспанія",
  de: "Німеччина",
  cz: "Чехія"
};

const URGENCY_LABELS: Record<string, string> = {
  high: "Терміново (<1 міс)",
  med: "1-3 місяці",
  low: "Тільки планую"
};

const SERVICE_LABELS: Record<string, string> = {
  basic: "Basic (Консультація)",
  standard: "Standard (Супровід)",
  premium: "Premium (Під ключ)"
};

async function getOrCreateLead(chatId: number, firstName: string | null, username: string | null): Promise<string> {
  // Ensure the funnel_step column exists
  try {
    await q(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS funnel_step TEXT`);
  } catch {}

  const existing = await one(
    `SELECT id, status FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(chatId)]
  ) as { id: string; status: string } | null;

  if (existing) {
    await q(
      `UPDATE leads
          SET first_name = COALESCE($2, first_name),
              username   = COALESCE($3, username)
        WHERE chat_id = $1 AND deleted_at IS NULL`,
      [String(chatId), firstName, username]
    );
    return existing.id;
  }

  const existingCrmLead = await one(`SELECT id FROM kompas_leads WHERE chat_id = $1 LIMIT 1`, [String(chatId)]);
  if (!existingCrmLead) {
    await q(
      `INSERT INTO kompas_leads (chat_id, source, name, contact, status)
       VALUES ($1, 'bot', $2, $3, 'new')`,
      [String(chatId), firstName || 'TG Користувач', username ? `@${username}` : String(chatId)]
    );
  }

  const row = await one(
    `INSERT INTO leads (chat_id, source, first_name, username, status, funnel_step)
     VALUES ($1, 'bot', $2, $3, 'new', 'step_1_qual')
     RETURNING id`,
    [String(chatId), firstName, username]
  ) as { id: string };

  await createTaskFromLead({
    name: firstName || "Користувач Telegram",
    contact: username ? `@${username}` : String(chatId),
    source: "bot",
  });
  return row.id;
}

async function syncLeadToCRM(chatId: string) {
  try {
    const lead = await one(
      `SELECT * FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
      [chatId]
    ) as any;
    if (!lead) return;

    const parts = [];
    if (lead.qualification) parts.push(`Мета: ${QUAL_LABELS[lead.qualification] || lead.qualification}`);
    if (lead.country) parts.push(`Країна: ${COUNTRY_LABELS[lead.country] || lead.country}`);
    if (lead.urgency) parts.push(`Терміновість: ${URGENCY_LABELS[lead.urgency] || lead.urgency}`);
    if (lead.service) parts.push(`Пакет: ${SERVICE_LABELS[lead.service] || lead.service}`);
    if (lead.situation) parts.push(`Повідомлення: ${lead.situation}`);
    const message = parts.join('\\n');

    const contact = lead.username ? `@${lead.username}` : lead.phone || chatId;
    const name = lead.first_name || 'TG Користувач';

    let crmStatus = lead.status;
    if (crmStatus === 'pending_manual') crmStatus = 'in_progress';

    const existingCrm = await one(`SELECT id FROM kompas_leads WHERE chat_id = $1 LIMIT 1`, [chatId]);
    if (existingCrm) {
      await q(
        `UPDATE kompas_leads SET name = $2, contact = $3, message = $4, status = $5 WHERE chat_id = $1`, 
        [chatId, name, contact, message, crmStatus]
      );
    } else {
      await q(
        `INSERT INTO kompas_leads (chat_id, source, name, contact, message, status) VALUES ($1, 'bot', $2, $3, $4, $5)`,
        [chatId, name, contact, message, crmStatus]
      );
    }
  } catch (err) {
    console.error('[webhook] Error syncing lead to CRM', err);
  }
}


export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || undefined;

  if (process.env.TELEGRAM_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let upd: TgUpdate;
  try {
    upd = await req.json() as TgUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = upd.callback_query?.message?.chat?.id ?? upd.callback_query?.from?.id ?? upd.message?.chat.id;
  if (!chatId) return NextResponse.json({ ok: true });

  const existingLead = await one(
    `SELECT status, funnel_step FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(chatId)]
  ) as { status: string; funnel_step: string } | null;

  const isStartCommand = upd.message?.text?.trim().startsWith("/start");

  if (existingLead?.status === "pending_manual" && !isStartCommand) {
    if (upd.callback_query) {
      await answerCallback(upd.callback_query.id, "Вже підключено до асистента", token);
    }
    return NextResponse.json({ ok: true });
  }

  /* ── Callback Query ──────────────────────────────────────────────── */
  if (upd.callback_query) {
    const cb = upd.callback_query;
    const data = cb.data ?? "";

    if (data === "bot_start") {
      await sendClarification(chatId, token);
      await answerCallback(cb.id, "Оберіть мету", token);
    }
    else if (data.startsWith("funnel_qual_")) {
      const val = data.replace("funnel_qual_", "");
      await q(
        `UPDATE leads SET qualification = $1, funnel_step = 'step_2_country'
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [val, String(chatId)]
      );
      await answerCallback(cb.id, `✅ ${QUAL_LABELS[val] || val}`, token);

      await sendInlineKeyboard(
        chatId,
        `📍 Дякуємо! Обрана категорія: <b>${QUAL_LABELS[val] || val}</b>.\n\n` +
        `Наступне запитання: <b>Оберіть країну призначення</b> для переїзду/легалізації:`,
        STEP_2_BUTTONS,
        token
      );
    } 
    
    else if (data.startsWith("funnel_country_")) {
      const val = data.replace("funnel_country_", "");
      await q(
        `UPDATE leads SET country = $1, funnel_step = 'step_3_urgency'
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [COUNTRY_LABELS[val] || val, String(chatId)]
      );
      await answerCallback(cb.id, `✅ ${COUNTRY_LABELS[val] || val}`, token);

      await sendInlineKeyboard(
        chatId,
        `📅 Країна: <b>${COUNTRY_LABELS[val] || val}</b>.\n\n` +
        `<b>Наскільки термінова ваша ситуація?</b> Оберіть часові рамки:`,
        STEP_3_BUTTONS,
        token
      );
    } 
    
    else if (data.startsWith("funnel_urg_")) {
      const val = data.replace("funnel_urg_", "");
      await q(
        `UPDATE leads SET urgency = $1, funnel_step = 'step_4_service'
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [URGENCY_LABELS[val] || val, String(chatId)]
      );
      await answerCallback(cb.id, `✅ Збережено`, token);

      await sendInlineKeyboard(
        chatId,
        `💰 <b>Оберіть бажаний пакет послуг супроводу</b>:`,
        STEP_4_BUTTONS,
        token
      );
    } 
    
    else if (data.startsWith("funnel_srv_")) {
      const val = data.replace("funnel_srv_", "");
      await q(
        `UPDATE leads SET service = $1, funnel_step = 'completed'
          WHERE chat_id = $2 AND deleted_at IS NULL`,
        [SERVICE_LABELS[val] || val, String(chatId)]
      );
      await answerCallback(cb.id, `✅ Воронку завершено!`, token);

      await sendCommunityInvitation(chatId, token);
    } 
    
    else if (data === "action_call_human") {
      await q(
        `UPDATE leads SET status = 'pending_manual', funnel_step = 'manual'
          WHERE chat_id = $1 AND deleted_at IS NULL`,
        [String(chatId)]
      );
      const lead = await one(
        `SELECT first_name, username, phone FROM leads WHERE chat_id = $1 AND deleted_at IS NULL LIMIT 1`,
        [String(chatId)]
      ) as { first_name?: string; username?: string; phone?: string } | null;

      await createTaskFromLead({
        name: lead?.first_name || "Користувач Telegram",
        contact: lead?.username ? `@${lead.username}` : (lead?.phone || String(chatId)),
        source: "bot_manual_request",
      });

      await answerCallback(cb.id, "✅ Запит надіслано", token);
      await sendMessage(
        chatId,
        `🔔 <b>Бот-асистента зупинено.</b>\n\n` +
        `Менеджер зв'яжеться з тобою напряму в чаті найближчим часом.\n` +
        `Контактний телефон: <b>+48 729 271 848</b>`,
        "HTML",
        token
      );
    } 
    
    else {
      await answerCallback(cb.id, "", token);
    }
    
    await syncLeadToCRM(String(chatId));
    return NextResponse.json({ ok: true });
  }

  /* ── Plain Text Message ───────────────────────────────────────────── */
  const msg = upd.message;
  if (!msg) return NextResponse.json({ ok: true });

  const from = msg.from;
  const text = (msg.text ?? "").trim();
  const username = from?.username ?? null;
  const firstName = from?.first_name ?? null;

  if (isStartCommand) {
    await getOrCreateLead(chatId, firstName, username);
    await q(
      `UPDATE leads SET status = 'new', funnel_step = 'step_1_qual'
        WHERE chat_id = $1 AND deleted_at IS NULL`,
      [String(chatId)]
    );

    await sendGreeting(chatId, firstName || "вас", token);
    await syncLeadToCRM(String(chatId));
    return NextResponse.json({ ok: true });
  }

  if (text) {
    await getOrCreateLead(chatId, firstName, username);
    await q(
      `UPDATE leads SET situation = $1
        WHERE chat_id = $2 AND deleted_at IS NULL`,
      [text, String(chatId)]
    );

    await sendInlineKeyboard(
      chatId,
      `✅ Ваше повідомлення прийнято!\n\n` +
      `Натисніть кнопку нижче, щоб завершити підбір або покликати менеджера:`,
      [
        [
          { text: "🚀 Пройти опитування", callback_data: "funnel_qual_work" }
        ],
        [
          { text: "👤 Покликати асистента", callback_data: "action_call_human" }
        ]
      ],
      token
    );
    await syncLeadToCRM(String(chatId));
  }

  return NextResponse.json({ ok: true });
}

