/* lib/whatsapp.ts — відправка WhatsApp-повідомлень через CallMeBot API.
   Безкоштовно для особистого використання.

   ── Активація (одноразово) ──────────────────────────────────────────────
   1. Додайте +34 644 43 96 77 в контакти WhatsApp як "CallMeBot"
   2. Надішліть їм повідомлення: "I allow callmebot to send me messages"
   3. Отримаєте API-ключ у відповіді
   4. Додайте у Vercel env: CALLMEBOT_API_KEY=ваш_ключ
   ────────────────────────────────────────────────────────────────────── */

/**
 * Надсилає WhatsApp-повідомлення через CallMeBot.
 * @param phone  Номер без "+" і пробілів, напр. "48729417050"
 * @param text   Текст повідомлення (UTF-8)
 */

export const ADMIN_WA_PHONES = ['48729417050', '48729271848'];

export async function sendAdminWhatsApp(text: string): Promise<void> {
  await Promise.all(ADMIN_WA_PHONES.map(phone => sendWhatsApp(phone, text)));
}

export async function sendWhatsApp(phone: string, text: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) {
    console.warn("sendWhatsApp: CALLMEBOT_API_KEY not set — skipping");
    return;
  }

  // CallMeBot потребує телефон без "+" і пробілів
  const cleanPhone = phone.replace(/[^\d]/g, "");

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(cleanPhone)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      console.error("sendWhatsApp: CallMeBot error", res.status, body);
    }
  } catch (err) {
    console.error("sendWhatsApp: fetch failed", err);
  }
}

/**
 * Надсилає звичайне текстове WhatsApp-повідомлення через Meta Cloud API
 * (використовується для відповідей менеджера з CRM-чатів).
 * Якщо WHATSAPP_TOKEN/WHATSAPP_PHONE_ID не налаштовані — працює в mock-режимі
 * (лог у консоль, success:true), щоб CRM не блокувалась відсутністю креденшелів.
 */
export async function sendWhatsAppText(phone: string, text: string): Promise<{ ok: boolean; mocked?: boolean }> {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[WHATSAPP MOCK SEND] To: ${phone} | MSG: ${text}`);
    return { ok: true, mocked: true };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text },
      }),
    });
    if (!res.ok) {
      console.error("sendWhatsAppText: API error", res.status, await res.text());
    }
    return { ok: res.ok };
  } catch (err) {
    console.error("sendWhatsAppText: fetch failed", err);
    return { ok: false };
  }
}

// OUTBOUND MESSAGE INITIATOR
export async function sendInitialMessage(phone: string, template: string = "hello_architecture") {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[WHATSAPP MOCK OUTBOUND] Sent initial template to ${phone}`);
    return true;
  }

  const res = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: template,
        language: { code: "uk" }
      }
    })
  });

  return res.ok;
}
