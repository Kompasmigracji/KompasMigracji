export const dynamic = "force-dynamic";
/* Stage 8: Orakul web-chat abandonment detection — Vercel Cron.
   Finds sessions with server-side history (stage 7) that stalled before
   reaching the candidate/employer questionnaire finish line, and alerts
   admin once per stalled session. */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notifyAdmin } from "@/lib/telegram";
import { sendEmail, orakulAbandonedEmailHtml } from "@/lib/email";

const STALE_MINUTES = 30;

interface StaleLead {
  id: string;
  chat_id: string;
  history: { role: string; content: string }[];
  last_activity_at: string;
}

function verifyCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return auth === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

function buildTranscript(history: { role: string; content: string }[]): string {
  return history.map((m) => `${m.role === "user" ? "Клієнт" : "Бот"}: ${m.content}`).join("\n");
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stale = (await q(
    `SELECT id, chat_id, history, last_activity_at FROM leads
     WHERE deleted_at IS NULL
       AND source = 'orakul_web'
       AND status = 'new'
       AND abandoned_notified_at IS NULL
       AND last_activity_at < NOW() - INTERVAL '${STALE_MINUTES} minutes'
       AND jsonb_array_length(COALESCE(history, '[]'::jsonb)) > 0
     ORDER BY last_activity_at ASC
     LIMIT 50`
  )) as StaleLead[];

  const notifyEmail = process.env.EMPLOYER_LEAD_NOTIFY_EMAIL;

  for (const lead of stale) {
    const transcript = buildTranscript(lead.history || []);

    notifyAdmin(
      `👋 <b>Оракул: покинута розмова (Web)</b>\nСесія: ${lead.chat_id}\nОстанній меседж: ${new Date(lead.last_activity_at).toLocaleString("uk-UA")}\n\n${transcript.slice(0, 3000)}`
    ).catch((e) => console.error("[cron/orakul-abandoned] Telegram notify failed:", e));

    if (notifyEmail) {
      sendEmail(
        notifyEmail,
        `Оракул: покинута розмова (${lead.chat_id})`,
        orakulAbandonedEmailHtml(lead.chat_id, transcript, lead.last_activity_at),
        "orakul_abandoned"
      ).catch((e) => console.error("[cron/orakul-abandoned] Email notify failed:", e));
    }

    await q(`UPDATE leads SET abandoned_notified_at = NOW() WHERE id = $1`, [lead.id]);
  }

  return NextResponse.json({ ok: true, notified: stale.length });
}
