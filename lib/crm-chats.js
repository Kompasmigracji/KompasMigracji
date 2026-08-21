/* lib/crm-chats.js — CRM chat inbox (custom_chats/custom_messages) helpers.
   Shared between the admin CRM chats API routes and the Telegram/WhatsApp/Viber/
   Facebook Messenger inbound webhooks, so inbound messages on all four channels
   show up in one unified staff inbox (app/admin/crm/chats/page.jsx). */
import { q, one } from "./db";

const SOURCE_META = {
  telegram: { icon: "send", color: "#229ED9" },
  whatsapp: { icon: "message-circle", color: "#25D366" },
  viber: { icon: "phone", color: "#7360F2" },
  facebook: { icon: "message-square", color: "#0084FF" },
  instagram: { icon: "instagram", color: "#E1306C" },
  manual: { icon: "user", color: "#6b7280" },
};

export function sourceMeta(source) {
  return SOURCE_META[source] || SOURCE_META.manual;
}

function timeStr() {
  return new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

/** Find the CRM chat thread for an external contact (by channel + external id), or create it. */
export async function findOrCreateChat(source, externalId, name) {
  const existing = await one(
    `SELECT id FROM custom_chats WHERE source = $1 AND external_id = $2 LIMIT 1`,
    [source, externalId]
  );
  if (existing) return existing.id;

  const meta = sourceMeta(source);
  const created = await one(
    `INSERT INTO custom_chats (name, source, external_id, source_icon, source_color, last_message, time, unread, status)
     VALUES ($1, $2, $3, $4, $5, '', $6, 0, 'open') RETURNING id`,
    [name || externalId, source, externalId, meta.icon, meta.color, timeStr()]
  );
  return created.id;
}

/** Append a message to a chat thread and bump last_message/time (and unread, for inbound). */
export async function appendMessage(chatId, text, sender) {
  if (!text) return;
  const t = timeStr();
  await q(
    `INSERT INTO custom_messages (chat_id, text, time, sender, is_seen) VALUES ($1, $2, $3, $4, $5)`,
    [chatId, text, t, sender, sender === "manager"]
  );
  if (sender === "client") {
    await q(
      `UPDATE custom_chats SET last_message = $1, time = $2, unread = COALESCE(unread, 0) + 1, status = 'open' WHERE id = $3`,
      [text, t, chatId]
    );
  } else {
    await q(
      `UPDATE custom_chats SET last_message = $1, time = $2 WHERE id = $3`,
      [text, t, chatId]
    );
  }
}
