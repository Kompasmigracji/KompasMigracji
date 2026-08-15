export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminWhatsAppConfigs } from "@/lib/whatsapp";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
  const text = `🟢 *ТЕСТОВЕ ПОВІДОМЛЕННЯ*\nЦе системний тест.`;
  const admins = getAdminWhatsAppConfigs();
  const results = [];
  
  for (const admin of admins) {
    if (!admin.apiKey) {
      results.push({ phone: admin.phone, error: `API key not found in Vercel (${admin.envVarName})` });
      continue;
    }

    const cleanPhone = admin.phone.replace(/[^\d]/g, "");
    const url =
      `https://api.callmebot.com/whatsapp.php` +
      `?phone=${encodeURIComponent(cleanPhone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(admin.apiKey)}`;
      
    try {
      const res = await fetch(url);
      const body = await res.text();
      results.push({ phone: admin.phone, ok: res.ok, status: res.status, body });
    } catch (err: any) {
      results.push({ phone: admin.phone, error: err.message });
    }
    
    await delay(1000); // 1 second delay to avoid CallMeBot rate limits
  }
  
  return NextResponse.json({ results });
}
