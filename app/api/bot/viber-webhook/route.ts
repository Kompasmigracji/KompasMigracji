/* /api/bot/viber-webhook — Viber Bot webhook KompasCRM.
   
   Реєструється у Viber REST API.
   POST -> Отримання подій (webhook handshake, conversation_started, message) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { createTaskFromLead } from "@/lib/task-from-lead";

export async function POST(req: NextRequest) {
  try {
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

        // Check if lead already exists by Viber sender ID
        const existing = (await one(
          `SELECT id FROM leads WHERE chat_id = $1 AND source = 'viber' AND deleted_at IS NULL LIMIT 1`,
          [senderId]
        )) as { id: string } | null;

        if (existing) {
          // Update existing lead details
          await q(
            `UPDATE leads 
                SET situation = $1, 
                    message = COALESCE($1, message)
              WHERE id = $2`,
            [messageText, existing.id]
          );
        } else {
          // Create new lead record
          await one(
            `INSERT INTO leads (chat_id, source, first_name, situation, status)
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
