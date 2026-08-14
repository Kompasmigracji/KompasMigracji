export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendAdminWhatsApp } from "@/lib/whatsapp";

export async function GET() {
  const text = `🟢 *ТЕСТОВЕ ПОВІДОМЛЕННЯ*\nЦе системний тест із сервера KompasMigracji.\n\nЯкщо ви отримали це повідомлення, значить оновлена система розсилки успішно відправила його одночасно на два номери: Олександру та вам! ✅`;
  
  await sendAdminWhatsApp(text);
  
  return NextResponse.json({ success: true, message: "Test WhatsApp message sent" });
}
