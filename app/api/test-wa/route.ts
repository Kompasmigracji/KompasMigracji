export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ADMIN_WA_PHONES } from "@/lib/whatsapp";

export async function GET() {
  const text = `🟢 *ТЕСТОВЕ ПОВІДОМЛЕННЯ*\nЦе системний тест.`;
  const apiKey = process.env.CALLMEBOT_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "CALLMEBOT_API_KEY not set in Vercel" });
  }

  const results = [];
  
  for (const phone of ADMIN_WA_PHONES) {
    const cleanPhone = phone.replace(/[^\d]/g, "");
    const url =
      `https://api.callmebot.com/whatsapp.php` +
      `?phone=${encodeURIComponent(cleanPhone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(apiKey)}`;
      
    try {
      const res = await fetch(url);
      const body = await res.text();
      results.push({ phone, ok: res.ok, status: res.status, body });
    } catch (err: any) {
      results.push({ phone, error: err.message });
    }
  }
  
  return NextResponse.json({ results });
}
