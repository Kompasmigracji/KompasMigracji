import { sendInlineKeyboard, sendMessage } from "./telegram";
import { q } from "./db";

export async function sendGreeting(chatId: number, name: string, token?: string) {
  const text = `👋 Вітаємо, ${name}! Я — Orakul, автоматичний асистент Компасу Міграції. Я допоможу підібрати найкращі варіанти для легалізації та адаптації.`;
  const buttons = [
    [
      { text: "🚀 Розпочати", callback_data: "bot_start" }
    ]
  ];
  await sendInlineKeyboard(chatId, text, buttons, token);
}

export async function sendClarification(chatId: number, token?: string) {
  const text = `Будь ласка, уточніть вашу мету:`;
  const buttons = [
    [
      { text: "🏢 Праця", callback_data: "funnel_qual_work" },
      { text: "📚 Навчання", callback_data: "funnel_qual_study" }
    ],
    [
      { text: "👤 Покликати асистента", callback_data: "action_call_human" }
    ]
  ];
  await sendInlineKeyboard(chatId, text, buttons, token);
}

export async function sendCommunityInvitation(chatId: number, token?: string) {
  const text = `🎉 Запрошуємо вас приєднатися до нашого клубу та каналів, щоб отримати безкоштовні матеріали:`;
  const buttons = [
    [
      { text: "📢 Telegram-канал", url: "https://t.me/kompasmigracji" },
      { text: "📳 Viber-спільнота", url: "viber://chat?number=48729271848" }
    ]
  ];
  await sendInlineKeyboard(chatId, text, buttons, token);
}
