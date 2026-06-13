import { sendInlineKeyboard, sendMessage } from "./telegram";

export async function sendLanguagePanel(chatId: number, name: string, token?: string) {
  const text = `👋 Вітаємо, ${name}! Оберіть зручну для вас мову / Choose your language:`;
  const buttons = [
    [
      { text: "🇺🇦 Українська", callback_data: "lang_ua" },
      { text: "🇷🇺 Русский", callback_data: "lang_ru" }
    ],
    [
      { text: "🇵🇱 Polski", callback_data: "lang_pl" },
      { text: "🇬🇧 English", callback_data: "lang_en" }
    ]
  ];
  await sendInlineKeyboard(chatId, text, buttons, token);
}

export async function sendMainMenu(chatId: number, lang: string, token?: string) {
  let text = `Чим ми можемо вам допомогти?`;
  let btnWork = "🏢 Праця";
  let btnStudy = "📚 Навчання";
  let btnLegal = "⚖️ Легалізація";
  let btnHuman = "👤 Покликати менеджера";

  if (lang === 'lang_ru') {
    text = `Чем мы можем вам помочь?`;
    btnWork = "🏢 Работа";
    btnStudy = "📚 Обучение";
    btnLegal = "⚖️ Легализация";
    btnHuman = "👤 Позвать менеджера";
  } else if (lang === 'lang_pl') {
    text = `W czym możemy Ci pomóc?`;
    btnWork = "🏢 Praca";
    btnStudy = "📚 Edukacja";
    btnLegal = "⚖️ Legalizacja";
    btnHuman = "👤 Zawołaj menedżera";
  } else if (lang === 'lang_en') {
    text = `How can we help you?`;
    btnWork = "🏢 Work";
    btnStudy = "📚 Study";
    btnLegal = "⚖️ Legalization";
    btnHuman = "👤 Call manager";
  }

  const buttons = [
    [
      { text: btnWork, callback_data: "funnel_work" },
      { text: btnStudy, callback_data: "funnel_study" }
    ],
    [
      { text: btnLegal, callback_data: "funnel_legal" },
      { text: btnHuman, callback_data: "action_call_human" }
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
