/* lib/viber.ts — відправка Viber-повідомлень через Viber REST API.
   Потребує VIBER_BOT_TOKEN (auth token бота, видається у Viber Admin Panel).
   Без нього працює в mock-режимі (лог у консоль), щоб CRM не блокувалась
   відсутністю креденшелів. */

const VIBER_API = "https://chatapi.viber.com/pa/send_message";

export async function sendViberMessage(receiverId: string, text: string): Promise<{ ok: boolean; mocked?: boolean }> {
  const token = process.env.VIBER_BOT_TOKEN;

  if (!token) {
    console.log(`[VIBER MOCK SEND] To: ${receiverId} | MSG: ${text}`);
    return { ok: true, mocked: true };
  }

  try {
    const res = await fetch(VIBER_API, {
      method: "POST",
      headers: {
        "X-Viber-Auth-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver: receiverId,
        type: "text",
        sender: { name: "Kompas Migracji" },
        text,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.status !== 0) {
      console.error("sendViberMessage: API error", res.status, data);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendViberMessage: fetch failed", err);
    return { ok: false };
  }
}
