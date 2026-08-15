/* lib/whatsapp.ts — відправка WhatsApp-повідомлень через CallMeBot API.
   Безкоштовно для особистого використання.

   ── Активація (одноразово) ──────────────────────────────────────────────
   1. Додайте +34 644 43 96 77 в контакти WhatsApp як "CallMeBot"
   2. Надішліть їм повідомлення: "I allow callmebot to send me messages"
   3. Отримаєте API-ключ у відповіді
   4. Додайте у Vercel env: CALLMEBOT_API_KEY_1=ваш_ключ та CALLMEBOT_API_KEY_2=ключ_олександра
   ────────────────────────────────────────────────────────────────────── */

export function getAdminWhatsAppConfigs() {
  return [
    { phone: '48729417050', apiKey: process.env.CALLMEBOT_API_KEY_1, envVarName: 'CALLMEBOT_API_KEY_1' },
    { phone: '48729271848', apiKey: process.env.CALLMEBOT_API_KEY_2, envVarName: 'CALLMEBOT_API_KEY_2' },
  ];
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function sendAdminWhatsApp(text: string): Promise<void> {
  const admins = getAdminWhatsAppConfigs();
  
  // CallMeBot rate-limits if we send requests concurrently. Send sequentially with a small delay.
  for (const admin of admins) {
    if (!admin.apiKey) {
      console.warn(`sendAdminWhatsApp: ${admin.envVarName} not set for ${admin.phone} — skipping`);
      continue;
    }
    const cleanPhone = admin.phone.replace(/[^\d]/g, "");
    const url =
      `https://api.callmebot.com/whatsapp.php` +
      `?phone=${encodeURIComponent(cleanPhone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(admin.apiKey)}`;
      
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        console.error(`sendAdminWhatsApp to ${admin.phone} error`, res.status, body);
      }
    } catch (err) {
      console.error(`sendAdminWhatsApp to ${admin.phone} fetch failed`, err);
    }
    
    // 500ms delay to prevent "Too many requests" from CallMeBot
    await delay(500);
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
