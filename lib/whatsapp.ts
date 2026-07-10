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
