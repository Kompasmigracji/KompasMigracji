/* F15: Lead escalation + F17: Case deadline alerts
   Vercel Cron fires every 6 hours
   - Escalates uncontacted new leads after 24h
   - Alerts workers about overdue kompas_cases */
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

  // F15: Escalate leads not picked up in 24h
  const stale = await q(`
    SELECT id, first_name, service, urgency, score
    FROM leads
    WHERE deleted_at IS NULL
      AND COALESCE(status,'new') = 'new'
      AND auto_assigned_to IS NULL
      AND escalated_at IS NULL
      AND created_at < now() - interval '24 hours'
    ORDER BY score DESC
    LIMIT 50`);

  let escalated = 0;
  if (stale.length > 0) {
    // Notify admin via Telegram
    const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChat) {
      const lines = stale.slice(0, 10).map(
        l => `• ${l.first_name || "?"} | ${l.service || "—"} | score: ${l.score}`,
      ).join("\n");
      try {
        await sendMessage(
          adminChat,
          `🚨 <b>Ескалація лідів</b>\n\n` +
          `${stale.length} лідів без відповіді > 24 год:\n${lines}\n\n` +
          `Зайдіть в адмін-панель: /admin/leads`,
          "HTML",
        );
      } catch { /* non-blocking */ }
    }

    // Mark as escalated
    const ids = stale.map(l => l.id);
    await q(
      `UPDATE leads SET escalated_at=now() WHERE id = ANY($1::bigint[])`,
      [ids],
    );
    escalated = stale.length;
  }

  // F17: Overdue kompas_cases alerts
  const overdueCases = await q(`
    SELECT c.id, c.title, c.updated_at,
           u.full_name AS worker_name
    FROM kompas_cases c
    LEFT JOIN kompas_users u ON u.id = c.assigned_to
    WHERE c.status IN ('open','in_progress')
      AND c.updated_at < now() - interval '7 days'
    LIMIT 50`);

  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChat && overdueCases.length > 0) {
    const lines = overdueCases.slice(0, 5).map(
      c => `• ${c.title} (${c.worker_name || "без виконавця"})`,
    ).join("\n");
    try {
      await sendMessage(
        adminChat,
        `⏰ <b>Прострочені справи</b>\n\n` +
        `${overdueCases.length} справ без оновлень > 7 днів:\n${lines}\n\n` +
        `Перевірте: /admin/cases`,
        "HTML",
      );
    } catch { /* non-blocking */ }
  }

  return NextResponse.json({
    ok: true,
    escalated,
    overdueAlertsCount: overdueCases.length,
  });
}
