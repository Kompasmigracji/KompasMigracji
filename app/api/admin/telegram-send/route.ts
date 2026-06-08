export const dynamic = "force-dynamic";
/* /api/admin/telegram-send — надіслати повідомлення клієнту з адмін-панелі.
   POST { lead_id, text } — відправити text у Telegram чат ліда.
   Доступно тільки для admin і moderator. */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { lead_id?: string; text?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const { lead_id, text } = body;
  if (!lead_id || !text?.trim()) {
    return NextResponse.json({ error: "Потрібні lead_id та text" }, { status: 400 });
  }

  // Знайти chat_id ліда
  const lead = (await one(
    `SELECT chat_id FROM leads WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
    [lead_id],
  )) as { chat_id: number | null } | null;

  if (!lead) {
    return NextResponse.json({ error: "Лід не знайдено" }, { status: 404 });
  }
  if (!lead.chat_id) {
    return NextResponse.json({ error: "Цей лід не підключений до Telegram" }, { status: 422 });
  }

  try {
    const result = await sendMessage(lead.chat_id, text);
    if (!result.ok) {
      return NextResponse.json({ error: "Telegram помилка: " + result.description }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
