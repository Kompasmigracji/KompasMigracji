/* /api/bot/setup — реєстрація вебхука Telegram.
   Виклик один раз після деплою:
     GET https://your-domain.com/api/bot/setup

   Потрібен заголовок Authorization: Bearer <CRON_SECRET> або запит тільки з localhost.
   Або просто захистіть через middleware/env-check. */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { setWebhook } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  // Захист: простий секрет у query
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!process.env.TELEGRAM_SETUP_SECRET || secret !== process.env.TELEGRAM_SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const host = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get("host")}`;
  const webhookUrl = `${host}/api/bot/webhook`;

  try {
    const result = await setWebhook(webhookUrl, process.env.TELEGRAM_WEBHOOK_SECRET);
    return NextResponse.json({ ok: true, webhookUrl, result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
