import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const adminChatAlt = process.env.ADMIN_TELEGRAM_CHAT_ID;

  const info: Record<string, any> = {
    has_token: !!token,
    token_prefix: token ? token.slice(0, 12) + "..." : null,
    TELEGRAM_ADMIN_CHAT_ID: adminChat || null,
    ADMIN_TELEGRAM_CHAT_ID: adminChatAlt || null,
  };

  if (token) {
    try {
      const me = await fetch(https://api.telegram.org/bot + token + /getMe);
      info.bot_info = await me.json();
    } catch (e: any) {
      info.bot_info_error = e.message;
    }
  }

  const targetChat = adminChat || adminChatAlt;
  if (token && targetChat) {
    try {
      const result = await sendMessage(targetChat, "Тест: сповіщення Kompas CRM. Якщо отримали - все OK!", "HTML");
      info.send_result = result;
    } catch (e: any) {
      info.send_error = e.message;
    }
  } else {
    info.send_error = Missing:  + (!token ? "TELEGRAM_BOT_TOKEN " : "") + (!targetChat ? "TELEGRAM_ADMIN_CHAT_ID" : "");
  }

  return NextResponse.json(info);
}
