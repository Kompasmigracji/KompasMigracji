export const dynamic = "force-dynamic";
/* F18: Weekly digest to admin — Vercel Cron fires Monday 08:00 UTC
   Sends Telegram summary: new leads, conversions, revenue, members */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one } from "@/lib/db";
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

  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChat) {
    return NextResponse.json({ ok: false, reason: "TELEGRAM_ADMIN_CHAT_ID not set" });
  }

  const [leads, members, dues, cases] = await Promise.all([
    one(`SELECT
      count(*) FILTER (WHERE created_at > now()-interval '7 days') AS new_week,
      count(*) FILTER (WHERE status='closed' AND created_at > now()-interval '7 days') AS converted_week,
      count(*) FILTER (WHERE paid_at > now()-interval '7 days') AS paid_week
      FROM leads WHERE deleted_at IS NULL`),
    one(`SELECT
      count(*) FILTER (WHERE created_at > now()-interval '7 days') AS new_week,
      count(*) FILTER (WHERE status='active') AS active_total
      FROM kompas_users WHERE role='member'`),
    one(`SELECT coalesce(sum(amount) FILTER (WHERE paid=true AND paid_at > now()-interval '7 days'), 0) AS week_revenue
         FROM kompas_dues`),
    one(`SELECT count(*) FILTER (WHERE status IN ('open','in_progress')) AS open_count
         FROM kompas_cases`),
  ]);

  const weekRevenue = Number(dues?.week_revenue || 0);
  const newLeads = Number(leads?.new_week || 0);
  const converted = Number(leads?.converted_week || 0);
  const paid = Number(leads?.paid_week || 0);
  const newMembers = Number(members?.new_week || 0);
  const totalMembers = Number(members?.active_total || 0);
  const openCases = Number(cases?.open_count || 0);

  const convRate = newLeads > 0 ? Math.round((converted / newLeads) * 100) : 0;

  const text =
    `📊 <b>Тижневий звіт Kompas Migracji</b>\n` +
    `——————————————\n` +
    `🔵 Нові ліди: <b>${newLeads}</b>\n` +
    `✅ Конвертовано: <b>${converted}</b> (${convRate}%)\n` +
    `💳 Оплачено: <b>${paid}</b>\n` +
    `——————————————\n` +
    `👥 Нові учасники: <b>${newMembers}</b>\n` +
    `👥 Всього активних: <b>${totalMembers}</b>\n` +
    `——————————————\n` +
    `💰 Дохід за тиждень: <b>${weekRevenue.toFixed(2)} zł</b>\n` +
    `📂 Відкритих справ: <b>${openCases}</b>\n` +
    `——————————————\n` +
    `Детальніше: /admin`;

  try {
    await sendMessage(adminChat, text, "HTML");
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newLeads, converted, weekRevenue });
}
