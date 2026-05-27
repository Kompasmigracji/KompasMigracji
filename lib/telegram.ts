/* KompasCRM — Telegram Bot API helper.
   Використовується у вебхуці бота та адмін-панелі для відправки повідомлень. */

const BOT_API = "https://api.telegram.org/bot";

function tok(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN not configured");
  return t;
}

async function tgPost(method: string, payload: object): Promise<Record<string, unknown>> {
  const res = await fetch(`${BOT_API}${tok()}/${method}`, {
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
) {
  return tgPost("sendMessage", { chat_id: chatId, text, parse_mode: parseMode });
}

/** Відправити повідомлення з inline-кнопками. */
export function sendInlineKeyboard(
  chatId: number | string,
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>,
) {
  return tgPost("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons },
  });
}

/** Відповісти на callback_query (прибирає «годинник» на кнопці). */
export function answerCallback(callbackQueryId: string, text = "") {
  return tgPost("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}

/** Зареєструвати вебхук у Telegram. Виклик один раз після деплою. */
export function setWebhook(webhookUrl: string, secret?: string) {
  return tgPost("setWebhook", {
    url: webhookUrl,
    ...(secret ? { secret_token: secret } : {}),
  });
}
