/* lib/facebook.ts — відправка повідомлень через Meta Messenger Send API.
   Потребує FB_PAGE_ACCESS_TOKEN (Page Access Token сторінки Facebook, прив'язаної
   до app/api/bot/fb-webhook, видається у Meta App Dashboard). Без нього працює в
   мок-режимі (лог у консоль), щоб CRM не блокувалась відсутністю креденшелів —
   той самий патерн, що й sendWhatsAppText (lib/whatsapp.ts) та sendViberMessage
   (lib/viber.ts). */

const FB_GRAPH_VERSION = "v19.0";

/**
 * Надсилає текстове повідомлення користувачу Facebook Messenger через Send API.
 * @param recipientId  PSID (page-scoped ID) отримувача — те саме значення, що
 *                      приходить як `sender.id` у app/api/bot/fb-webhook.
 * @param text          Текст повідомлення (UTF-8).
 */
export async function sendFacebookMessage(recipientId: string, text: string): Promise<{ ok: boolean; mocked?: boolean }> {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!token) {
    console.log(`[FACEBOOK MOCK SEND] To: ${recipientId} | MSG: ${text}`);
    return { ok: true, mocked: true };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${FB_GRAPH_VERSION}/me/messages?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          messaging_type: "RESPONSE",
          message: { text },
        }),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      console.error("sendFacebookMessage: API error", res.status, data);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendFacebookMessage: fetch failed", err);
    return { ok: false };
  }
}
