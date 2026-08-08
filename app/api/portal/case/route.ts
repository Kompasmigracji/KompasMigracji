export const dynamic = "force-dynamic";
/* Innovation 4: Client Portal — case status GET
   Admin creates portal session with PIN for each client
   F10: Manages portal session creation (POST) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { issuePortalPin } from "@/lib/portal";

/* POST — менеджер видає клієнту доступ до порталу.
 *
 * Тут був баг, через який портал не працював жодного дня: `Number(body.leadId)`
 * при leads.id типу uuid дає NaN, і роут завжди відповідав 400 «leadId
 * required». У kompas_portal_sessions лишалося 0 рядків. Той самий клас
 * помилки, що вже ловили в lead-followup (::bigint[] на uuid-колонці). */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }

  let body: { leadId?: unknown; notes?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  /* uuid як рядок — жодних приведень до числа. */
  const leadId = String(body.leadId || "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)) {
    return NextResponse.json({ error: "leadId має бути uuid" }, { status: 400 });
  }

  const lead = (await one(
    "SELECT id, first_name, chat_id, service, situation FROM leads WHERE id = $1 AND deleted_at IS NULL",
    [leadId],
  )) as {
    id: string;
    first_name: string | null;
    chat_id: number | null;
    service: string | null;
    situation: string | null;
  } | null;

  if (!lead) return NextResponse.json({ error: "Лід не знайдено" }, { status: 404 });

  const { pin, existed } = await issuePortalPin(leadId, {
    clientName: lead.first_name,
    service:    lead.service || lead.situation?.split("\n")[0],
    notes:      String(body.notes || ""),
  });

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.kompasmigracji.com").replace(/\/$/, "");

  /* Надсилаємо PIN у Telegram і при повторній видачі теж — «загубив доступ»
     це найчастіша причина, з якої менеджер тисне цю кнопку вдруге. */
  let sent = false;
  if (lead.chat_id) {
    try {
      await sendMessage(
        String(lead.chat_id),
        `🔐 <b>Ваш доступ до порталу Kompas Migracji</b>\n\n` +
        `PIN-код: <b>${pin}</b>\n\n` +
        `Портал: ${siteUrl}/portal\n\n` +
        `Там видно статус справи, ваші замовлення та оплати.`,
        "HTML",
      );
      sent = true;
    } catch {
      /* не блокуємо видачу через збій Telegram */
    }
  }

  return NextResponse.json({ pin, existed, sent });
}

// GET — list all portal sessions (admin)
export async function GET() {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }

  const rows = await q(`
    SELECT ps.pin, ps.client_name, ps.service, ps.status,
           ps.accessed_at, ps.pin_sent_at, ps.created_at,
           l.id AS lead_id, COALESCE(l.status,'new') AS lead_status
    FROM kompas_portal_sessions ps
    LEFT JOIN leads l ON l.id = ps.lead_id
    ORDER BY ps.created_at DESC LIMIT 100`);

  return NextResponse.json({ sessions: rows });
}
