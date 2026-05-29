/* F16: Auto dues reminder — Vercel Cron fires daily at 09:00 UTC
   Sends Telegram to members with unpaid dues (7 days / 1 day warnings) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";

function verifyCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return auth === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find leads with Telegram who have not paid (as proxy for members)
  // In practice: query kompas_dues joined with chat_id if stored
  const overdue = await q(`
    SELECT d.id, d.user_id, d.period, d.amount,
           u.full_name, u.phone
    FROM kompas_dues d
    JOIN kompas_users u ON u.id = d.user_id
    WHERE d.paid = false
      AND u.status = 'active'
    LIMIT 200`);

  // For leads (from Telegram bot) — unpaid for > 7 days
  const staleLeads = await q(`
    SELECT id, first_name, chat_id, created_at, service
    FROM leads
    WHERE deleted_at IS NULL
      AND chat_id IS NOT NULL
      AND COALESCE(status,'new') = 'new'
      AND created_at < now() - interval '7 days'
      AND paid_at IS NULL
    LIMIT 100`);

  let sent = 0;
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com").replace(/\/$/, "");

  // F16a: Remind telegram leads who haven't completed signup
  for (const lead of staleLeads) {
    try {
      const name = lead.first_name || "Вітаємо";
      await sendMessage(
        String(lead.chat_id),
        `👋 <b>${name}</b>, ваша заявка ще очікує розгляду!\n\n` +
        `Наші спеціалісти готові допомогти з вашим питанням.\n` +
        `Для консультації: ${siteUrl}/pricing\n\n` +
        `📞 Або телефонуйте: <b>+48 729 271 848</b>`,
        "HTML",
      );
      sent++;
      await new Promise(r => setTimeout(r, 100));
    } catch {
      // skip on error
    }
  }

  // F16b: Log reminder counts (no personal Telegram for members yet)
  return NextResponse.json({
    ok: true,
    overdueMembers: overdue.length,
    staleLeadsNotified: sent,
  });
}
