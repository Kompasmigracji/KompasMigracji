export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { notifyAdmin } from "@/lib/telegram";

export async function GET() {
  const text = `🟢 *ТЕСТОВЕ ПОВІДОМЛЕННЯ*\nЦе системний тест через Telegram. Якщо ви бачите це, інтеграція на два номери (або в спільну групу) працює ідеально! ✅`;
  
  try {
    const result = await notifyAdmin(text);
    return NextResponse.json({ success: true, message: "Test Telegram message sent", detail: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
