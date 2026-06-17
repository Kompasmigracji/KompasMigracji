/* KompasCRM — Telegram Bot API helper.
   Використовується у вебхуці бота та адмін-панелі для відправки повідомлень. */

const BOT_API = "https://api.telegram.org/bot";

function tok(token?: string): string {
  if (token) return token;
  const envToken = process.env.TELEGRAM_BOT_TOKEN;
  const envTokens = process.env.TELEGRAM_BOT_TOKENS;
  const fallback = envToken || (envTokens ? envTokens.split(',')[0] : undefined);
  if (!fallback) throw new Error("TELEGRAM_BOT_TOKEN not configured");
  return fallback.trim();
}

async function tgPost(method: string, payload: object, token?: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${BOT_API}${tok(token)}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/** Відправити текстове повідомлення (HTML-розмітка за замовчуванням). */
export function sendMessage(
  chatId: number | string,
  text: string,
  parseMode: "HTML" | "Markdown" | "MarkdownV2" = "HTML",
  token?: string,
  replyMarkup?: object
) {
  const payload: any = { chat_id: chatId, text, parse_mode: parseMode };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  return tgPost("sendMessage", payload, token);
}

/** Відправити повідомлення з inline-кнопками. */
export function sendInlineKeyboard(
  chatId: number | string,
  text: string,
  buttons: Array<Array<{ text: string; callback_data?: string; url?: string }>>,
  token?: string
) {
  return tgPost("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons },
  }, token);
}

/** Відповісти на callback_query (прибирає «годинник» на кнопці). */
export function answerCallback(callbackQueryId: string, text = "", token?: string) {
  return tgPost("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  }, token);
}

/** Зареєструвати вебхук у Telegram. Виклик один раз після деплою. */
export function setWebhook(webhookUrl: string, secret?: string, token?: string) {
  return tgPost("setWebhook", {
    url: webhookUrl,
    ...(secret ? { secret_token: secret } : {}),
  }, token);
}

/** Надіслати сповіщення адміністратору (власнику) */
export function notifyAdmin(text: string, token?: string) {
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
  if (!adminChatId) {
    console.warn("ADMIN_TELEGRAM_CHAT_ID is not set. Skipping admin notification.");
    return Promise.resolve({ ok: false, description: "No admin chat ID" });
  }
  return sendMessage(adminChatId, text, "HTML", token);
}
