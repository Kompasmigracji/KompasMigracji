export const dynamic = "force-dynamic";
/* Innovation 4: Client Portal — case status GET
   Admin creates portal session with PIN for each client
   F10: Manages portal session creation (POST) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { randomBytes } from "crypto";

function generatePin(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

// F10: POST — admin creates portal session for a lead
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { leadId?: unknown; notes?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const leadId = Number(body.leadId);
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  const lead = await one(
    "SELECT id, first_name, chat_id, service FROM leads WHERE id=$1 AND deleted_at IS NULL",
    [leadId],
  );
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  // Check existing
  const existing = await one("SELECT pin FROM kompas_portal_sessions WHERE lead_id=$1", [leadId]);
  if (existing) {
    return NextResponse.json({ pin: existing.pin, exists: true });
  }

  // Generate unique PIN
  let pin = generatePin();
  for (let i = 0; i < 5; i++) {
    const clash = await one("SELECT id FROM kompas_portal_sessions WHERE pin=$1", [pin]);
    if (!clash) break;
    pin = generatePin();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com").replace(/\/$/, "");

  await one(
    `INSERT INTO kompas_portal_sessions (pin, lead_id, client_name, service, notes, pin_sent_at)
     VALUES ($1, $2, $3, $4, $5, now()) RETURNING id`,
    [pin, leadId, lead.first_name || "Клієнт", lead.service || null, String(body.notes || "")],
  );

  // F11: Auto-send PIN via Telegram if chat_id exists
  if (lead.chat_id) {
    try {
      await sendMessage(
        String(lead.chat_id),
        `🔐 <b>Ваш доступ до порталу Kompas Migracji</b>\n\n` +
        `PIN-код для відстеження справи:\n<b>${pin}</b>\n\n` +
        `Перейдіть за посиланням:\n${siteUrl}/portal\n\n` +
        `Введіть PIN, щоб переглянути статус вашої заявки.`,
        "HTML",
      );
    } catch {
      // Non-blocking
    }
  }

  return NextResponse.json({ pin, sent: !!lead.chat_id });
}

// GET — list all portal sessions (admin)
export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const rows = await q(`
    SELECT ps.pin, ps.client_name, ps.service, ps.status,
           ps.accessed_at, ps.pin_sent_at, ps.created_at,
           l.id AS lead_id, COALESCE(l.status,'new') AS lead_status
    FROM kompas_portal_sessions ps
    LEFT JOIN leads l ON l.id = ps.lead_id
    ORDER BY ps.created_at DESC LIMIT 100`);

  return NextResponse.json({ sessions: rows });
}
