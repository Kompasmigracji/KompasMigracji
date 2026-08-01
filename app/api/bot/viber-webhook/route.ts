export const dynamic = "force-dynamic";
/* /api/bot/viber-webhook — Viber Bot webhook KompasCRM.
   
   Реєструється у Viber REST API.
   POST -> Отримання подій (webhook handshake, conversation_started, message) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { createTaskFromLead } from "@/lib/task-from-lead";
import { findOrCreateChat, appendMessage } from "@/lib/crm-chats";

export async function POST(req: NextRequest) {
  try {
    // Viber doesn't sign webhook requests the way Meta does — the only way to
    // authenticate the sender is a shared secret appended to the URL you register
    // via the Viber set_webhook call (?secret=...). Without it, anyone who finds
    // this URL can POST a fake message and have it create a real CRM lead + task.
    const webhookSecret = process.env.VIBER_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (req.nextUrl.searchParams.get("secret") !== webhookSecret) {
        console.warn("[viber-webhook] Rejected webhook: missing/invalid secret");
        return NextResponse.json({ status: 1, status_message: "forbidden" }, { status: 403 });
      }
    } else {
      console.warn("[viber-webhook] VIBER_WEBHOOK_SECRET not configured — webhook is unauthenticated");
    }

    const body = await req.json();

    // 1. Webhook handshake verification
    if (body.event === "webhook") {
      console.log("[viber-webhook] Handshake received and verified!");
      return NextResponse.json({ status: 0, status_message: "ok" });
    }

    // 2. Ingest message events
    if (body.event === "message") {
      const senderId = body.sender?.id;
      const senderName = body.sender?.name || "Користувач Viber";
      const messageText = body.message?.text?.trim();

      if (senderId && messageText) {
        console.log(`[viber-webhook] Received message from Viber ID ${senderId}: "${messageText}"`);

        try {
          const crmChatId = await findOrCreateChat("viber", senderId, senderName);
          await appendMessage(crmChatId, messageText, "client");
        } catch (e) {
          console.error("[viber-webhook] CRM chat mirror failed:", e);
        }

        // Check if lead already exists by Viber sender ID
        const existing = (await one(
          `SELECT id FROM kompas_leads WHERE chat_id = $1 AND source = 'viber' AND deleted_at IS NULL LIMIT 1`,
          [senderId]
        )) as { id: string } | null;

        if (existing) {
          // Update existing lead details
          await q(
            `UPDATE kompas_leads 
                SET situation = $1, 
                    message = COALESCE($1, message)
              WHERE id = $2`,
            [messageText, existing.id]
          );
        } else {
          // Create new lead record
          await one(
            `INSERT INTO kompas_leads (chat_id, source, first_name, situation, status)
             VALUES ($1, 'viber', $2, $3, 'new')
             RETURNING id`,
            [senderId, senderName, messageText]
          );

          // Dispatch task to operator team
          await createTaskFromLead({
            name: senderName,
            contact: `Viber ID: ${senderId}`,
            source: "viber",
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[viber-webhook] Error processing Viber webhook:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
