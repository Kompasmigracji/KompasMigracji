// F8: Appointment reminders cron — runs every 2h
// Sends Telegram + email reminder 24h before appointment
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendEmail } from "@/lib/email";

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com";
const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID;

function checkCronAuth(req: NextRequest): boolean {
  const cronHeader = req.headers.get("x-vercel-cron");
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return cronHeader === "1" || (!!secret && authHeader === `Bearer ${secret}`);
}

export async function POST(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Appointments in next 20-28h that haven't been reminded yet
  const upcoming = await q(
    `SELECT a.id, a.client_name, a.client_email, a.client_phone, a.service,
            a.appointment_at, a.meeting_link,
            l.chat_id
     FROM kompas_appointments a
     LEFT JOIN leads l ON l.id = a.lead_id
     WHERE a.status IN ('pending','confirmed')
       AND a.appointment_at BETWEEN now() + interval '20 hours' AND now() + interval '28 hours'
       AND a.reminder_sent = false`,
  );

  let notified = 0;

  for (const appt of upcoming) {
    const dateStr = new Date(appt.appointment_at).toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    const service = appt.service || "Konsultacja";

    // Telegram to client if they have chat_id
    if (appt.chat_id) {
      await sendMessage(
        appt.chat_id,
        `&#x1F4C5; <b>Przypomnienie o konsultacji</b>\n\n` +
        `Czesc, <b>${appt.client_name}</b>!\n` +
        `Jutro masz zaplanowana konsultacje:\n` +
        `<b>${service}</b> — ${dateStr}\n` +
        (appt.meeting_link ? `\nLink do spotkania: ${appt.meeting_link}` : "") +
        `\n\nW razie pytan napisz: https://wa.me/48729271848`,
        "HTML",
      ).catch(() => {});
      notified++;
    }

    // Email reminder
    if (appt.client_email) {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
<h2>&#x1F4C5; Przypomnienie o jutrzejszej konsultacji</h2>
<p>Czesc, <strong>${appt.client_name}</strong>!</p>
<p>Jutro o <strong>${dateStr}</strong> masz zaplanowana konsultacje: <strong>${service}</strong></p>
${appt.meeting_link ? `<p>Link do spotkania: <a href="${appt.meeting_link}">${appt.meeting_link}</a></p>` : ""}
<p>W razie potrzeby przelozenia: <a href="https://wa.me/48729271848">WhatsApp +48 729 271 848</a></p>
</body></html>`;
      await sendEmail(
        appt.client_email,
        `Przypomnienie: konsultacja jutro o ${dateStr}`,
        html,
        "appointment_reminder",
      ).catch(() => {});
      notified++;
    }

    await q("UPDATE kompas_appointments SET reminder_sent=true WHERE id=$1", [appt.id]);
  }

  return NextResponse.json({ ok: true, remindersCount: notified });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
