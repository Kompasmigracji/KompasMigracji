/* /api/payment-notify — Przelewy24 IPN webhook.
   Після успішної верифікації:
   1. Знаходить лід за session_id
   2. Оновлює paid_at + status = 'closed'
   3. Надсилає авто-повідомлення клієнту в Telegram (якщо є chat_id)
   4. Сповіщає адмін-чат про оплату */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { one, q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendWhatsApp } from "@/lib/whatsapp";
import { renderTemplate } from "@/lib/template-render";

const ADMIN_WA_PHONE = "48729417050";

export async function POST(req: NextRequest) {
  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? "", 10);
  const crc        = process.env.P24_CRC;
  const apiKey     = process.env.P24_API_KEY;
  const sandbox    = process.env.P24_SANDBOX === "true";

  if (!merchantId || !crc || !apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, orderId, amount, currency, sign } = body as Record<
    string,
    string | number
  >;

  /* ── 1. Перевірка підпису від Przelewy24 ───────────────────────── */
  const expectedSign = crypto
    .createHash("sha384")
    .update(JSON.stringify({ sessionId, orderId, amount, currency, crc }))
    .digest("hex");

  if (sign !== expectedSign) {
    console.error("P24 notify: invalid sign", { received: sign, expected: expectedSign });
    return NextResponse.json({ error: "Invalid sign" }, { status: 400 });
  }

  const BASE = sandbox
    ? "https://sandbox.przelewy24.pl"
    : "https://secure.przelewy24.pl";

  /* ── 2. Верифікація транзакції в P24 ───────────────────────────── */
  const verifySign = crypto
    .createHash("sha384")
    .update(JSON.stringify({ sessionId, orderId, amount, currency, crc }))
    .digest("hex");

  let verified = false;
  try {
    const r = await fetch(`${BASE}/api/v1/transaction/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${merchantId}:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        merchantId,
        posId: merchantId,
        sessionId,
        amount,
        currency,
        orderId,
        sign: verifySign,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("P24 verify failed:", text);
      return NextResponse.json({ error: "Verification failed" }, { status: 502 });
    }
    verified = true;
  } catch (err) {
    console.error("payment-notify error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (!verified) return NextResponse.json({ status: "ok" });

  /* ── 3. Знайти лід за session_id ───────────────────────────────── */
  type LeadRow = { id: string; chat_id: number | null; first_name: string | null; service: string | null };
  let lead: LeadRow | null = null;
  try {
    lead = (await one(
      `SELECT id, chat_id, first_name, service
         FROM leads
        WHERE session_id = $1 AND deleted_at IS NULL
        LIMIT 1`,
      [sessionId],
    )) as LeadRow | null;
  } catch {
    // Якщо стовпця session_id ще немає — просто логуємо і продовжуємо
    console.warn("payment-notify: session_id column missing or not found");
  }

  if (lead) {
    /* ── 4. Оновити статус ліда ─────────────────────────────────── */
    await q(
      `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1`,
      [lead.id],
    );

    /* ── 5. Авто-повідомлення клієнту в Telegram ────────────────── */
    if (lead.chat_id) {
      try {
        // Шукаємо шаблон з категорії payment + auto_send = true
        const tpl = (await one(
          `SELECT body FROM message_templates
            WHERE category = 'payment' AND auto_send = true
            ORDER BY sort_order ASC LIMIT 1`,
        )) as { body: string } | null;

        if (tpl) {
          const text = renderTemplate(tpl.body, {
            name:    lead.first_name ?? "клієнте",
            service: lead.service   ?? "",
            contact: "+48 729 271 848",
          });
          await sendMessage(lead.chat_id, text);
        } else {
          // Fallback якщо шаблону немає
          await sendMessage(
            lead.chat_id,
            `✅ <b>Оплату підтверджено!</b>\n\nДякуємо за довіру. Ваш менеджер зв'яжеться з вами найближчим часом.`,
          );
        }
      } catch (err) {
        console.error("payment-notify: Telegram send failed", err);
        // Не ламаємо відповідь P24 через помилку Telegram
      }
    }

    /* ── 6. Сповіщення адмін-чату ──────────────────────────────── */
    const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChat) {
      try {
        const amountFormatted = ((Number(amount) || 0) / 100).toFixed(2);
        await sendMessage(
          adminChat,
          `💳 <b>Нова оплата!</b>\n` +
          `Клієнт: ${lead.first_name ?? "—"}\n` +
          `Сума: ${amountFormatted} ${currency}\n` +
          `Session: <code>${sessionId}</code>`,
        );
      } catch { /* ігноруємо */ }
    }
  } else {
    // Лід не знайдено — просто сповіщаємо адміна
    const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChat) {
      try {
        await sendMessage(
          adminChat,
          `💳 Оплата отримана (лід не знайдено)\nSession: <code>${sessionId}</code>`,
        );
      } catch { /* ігноруємо */ }
    }
  }

  return NextResponse.json({ status: "ok" });
}
