export const dynamic = "force-dynamic";
// F3: Appointment booking — public endpoint
// POST { name, email, phone, service, appointmentAt, notes }
// Returns { id, appointmentAt }
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { sendMessage } from "@/lib/telegram";

const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const service = String(body.service || "").trim();
  const appointmentAt = body.appointmentAt ? new Date(String(body.appointmentAt)) : null;
  const notes = String(body.notes || "").trim();

  if (!name || !appointmentAt || isNaN(appointmentAt.getTime())) {
    return NextResponse.json({ error: "name and appointmentAt required" }, { status: 400 });
  }

  let apptId: number | null = null;
  try {
    const row = await one(
      `INSERT INTO kompas_appointments
        (client_name, client_email, client_phone, service, appointment_at, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING id`,
      [name, email || null, phone || null, service || null, appointmentAt, notes || null],
    );
    apptId = row?.id;
  } catch (err: any) {
    console.error("[appointment] DB error:", err.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const dateStr = appointmentAt.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });

  // Telegram notification to admin
  if (ADMIN_CHAT) {
    sendMessage(
      ADMIN_CHAT,
      `<b>&#x1F4C5; Nowa rezerwacja #${apptId}</b>\n` +
      `Klient: <b>${name}</b>${phone ? " · " + phone : ""}\n` +
      `Usluga: ${service || "nie podano"}\n` +
      `Termin: <b>${dateStr}</b>` +
      (notes ? `\nUwagi: ${notes}` : ""),
      "HTML",
    ).catch(() => {});
  }

  // Confirmation email to client
  if (email) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#111;">
<div style="text-align:center;padding:20px 0;border-bottom:2px solid #D8232A;margin-bottom:24px;">
  <div style="font-size:28px;">&#x1F9ED;</div>
  <div style="font-size:20px;font-weight:700;color:#D8232A;">Kompas Migracji</div>
</div>
<h2>Potwierdzenie rezerwacji &#x2705;</h2>
<p>Czesc, <strong>${name}</strong>!</p>
<p>Twoja konsultacja zostala zaplanowana na: <strong>${dateStr}</strong></p>
<p>Usluga: <strong>${service || "Konsultacja ogolna"}</strong></p>
<p>Nasz konsultant skontaktuje sie z Toba przed spotkaniem, aby potwierdzic szczegoly.</p>
<div style="text-align:center;margin:24px 0;">
  <a href="https://wa.me/48729271848" style="display:inline-block;padding:12px 24px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
    &#x1F4AC; Kontakt WhatsApp
  </a>
</div>
</body></html>`;
    sendEmail(email, "Potwierdzenie rezerwacji — Kompas Migracji", html, "appointment_confirm").catch(() => {});
  }

  return NextResponse.json({ id: apptId, appointmentAt: appointmentAt.toISOString() });
}

// GET — admin list (no auth for simplicity; add requireAuth if needed)
export async function GET() {
  try {
    const rows = await q(
      `SELECT id, client_name, client_email, client_phone, service,
              appointment_at, duration_min, status, notes, reminder_sent, created_at
       FROM kompas_appointments
       WHERE status NOT IN ('cancelled')
       ORDER BY appointment_at ASC LIMIT 100`,
    );
    return NextResponse.json({ appointments: rows });
  } catch {
    return NextResponse.json({ appointments: [] });
  }
}
