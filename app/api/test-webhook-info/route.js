import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const envToken = process.env.TELEGRAM_BOT_TOKEN;
  const envTokens = process.env.TELEGRAM_BOT_TOKENS;
  const rawTokens = envTokens ? envTokens.split(',').map(t => t.trim()) : (envToken ? [envToken.trim()] : []);
  
  const results = [];
  for (const t of rawTokens) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${t}/getWebhookInfo`);
      const data = await r.json();
      results.push({ token: t.substring(0, 10) + "...", info: data });
    } catch (e) {
      results.push({ token: t.substring(0, 10) + "...", error: e.message });
    }
  }
  return NextResponse.json({ results });
}
