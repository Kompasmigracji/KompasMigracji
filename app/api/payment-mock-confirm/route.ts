/* /api/payment-mock-confirm — симулює IPN від Przelewy24.
   Використовується ТІЛЬКИ в мок-режимі (P24_SANDBOX=mock або без ключів P24).
   POST { sessionId, success: boolean }
   → оновлює lead, надсилає Telegram-повідомлення */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { renderTemplate } from "@/lib/template-render";

function isMockMode(): boolean {
  return (
    process.env.P24_SANDBOX === "mock" ||
    !process.env.P24_MERCHANT_ID ||
    process.env.P24_MERCHANT_ID === "0"
  );
}

export async function POST(req: NextRequest) {
  /* ── Дозволено тільки в мок-режимі ─────────────────────────────── */
  if (!isMockMode()) {
    return NextResponse.json(
      { error: "Доступно тільки в мок-режимі (P24_SANDBOX=mock)" },
      { status: 403 },
    );
  }

  let body: { sessionId?: string; success?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, success } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "Потрібен sessionId" }, { status: 400 });
  }

  /* ── Платіж відхилено ────────────────────────────────────────────── */
  if (!success) {
    const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChat) {
      try {
        await sendMessage(
          adminChat,
          `⚠️ <b>[ТЕСТ] Платіж відхилено</b>\nSession: <code>${sessionId}</code>`,
        );
      } catch { /* ігноруємо */ }
    }
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  /* ── Знайти лід за session_id ────────────────────────────────────── */
  type LeadRow = {
    id: string;
    chat_id: number | null;
    first_name: string | null;
    service: string | null;
  };

  const lead = (await one(
    `SELECT id, chat_id, first_name, service
       FROM leads
      WHERE session_id = $1 AND deleted_at IS NULL
      LIMIT 1`,
    [sessionId],
  )) as LeadRow | null;

  if (!lead) {
    return NextResponse.json({ error: "Лід не знайдено" }, { status: 404 });
  }

  /* ── Оновити статус ліда ─────────────────────────────────────────── */
  await q(
    `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1`,
    [lead.id],
  );

  /* ── Telegram клієнту ────────────────────────────────────────────── */
  if (lead.chat_id) {
    try {
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
        await sendMessage(
          lead.chat_id,
          `✅ <b>Оплату підтверджено!</b>\n\nДякуємо за довіру. Ваш менеджер зв'яжеться з вами найближчим часом.`,
        );
      }
    } catch (err) {
      console.error("payment-mock-confirm: Telegram send failed", err);
    }
  }

  /* ── Telegram адміну ─────────────────────────────────────────────── */
  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChat) {
    try {
      await sendMessage(
        adminChat,
        `💳 <b>[ТЕСТ] Оплата підтверджена!</b>\n` +
        `Клієнт: ${lead.first_name ?? "—"}\n` +
        `Session: <code>${sessionId}</code>`,
      );
    } catch { /* ігноруємо */ }
  }

  return NextResponse.json({ ok: true, status: "confirmed" });
}
