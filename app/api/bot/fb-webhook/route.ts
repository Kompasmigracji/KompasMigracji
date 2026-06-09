export const dynamic = "force-dynamic";
/* /api/bot/fb-webhook — Facebook Messenger webhook KompasCRM.
   
   Реєструється в Meta Developer Dashboard.
   GET  -> Верифікація токена (hub.challenge)
   POST -> Отримання повідомлень від користувачів */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { createTaskFromLead } from "@/lib/task-from-lead";

/* ── GET: Meta Webhook Verification ────────────────────────────────── */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const localVerifyToken = process.env.FB_VERIFY_TOKEN || "kompas-fb-secret-token";

  if (mode === "subscribe" && token === localVerifyToken) {
    console.log("[fb-webhook] Webhook verified successfully!");
    return new Response(challenge, { status: 200 });
  }

  console.error("[fb-webhook] Verification failed. Token mismatch.");
  return new Response("Forbidden", { status: 403 });
}

/* ── POST: Ingest Facebook Messenger Messages ──────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== "page") {
      return NextResponse.json({ error: "Unsupported object type" }, { status: 400 });
    }

    // Process entries
    for (const entry of body.entry || []) {
      for (const messagingEvent of entry.messaging || []) {
        const senderId = messagingEvent.sender?.id;
        const messageText = messagingEvent.message?.text?.trim();

        if (senderId && messageText) {
          console.log(`[fb-webhook] Received message from FB PSID ${senderId}: "${messageText}"`);

          // Check if lead already exists by FB sender ID (stored in chat_id/tg_chat_id or meta metadata jsonb)
          const existing = (await one(
            `SELECT id FROM kompas_leads WHERE chat_id = $1 AND source = 'facebook' AND deleted_at IS NULL LIMIT 1`,
            [senderId]
          )) as { id: string } | null;

          if (existing) {
            // Update existing lead situation details
            await q(
              `UPDATE kompas_leads 
                  SET situation = $1, 
                      message = COALESCE($1, message)
                WHERE id = $2`,
              [messageText, existing.id]
            );
          } else {
            // Create a new lead record
            const newLead = (await one(
              `INSERT INTO kompas_leads (chat_id, source, first_name, situation, status)
               VALUES ($1, 'facebook', $2, $3, 'new')
               RETURNING id`,
              [senderId, `FB User ${senderId.slice(-4)}`, messageText]
            )) as { id: string };

            // Dispatch task to team
            await createTaskFromLead({
              name: `FB User ${senderId.slice(-4)}`,
              contact: `FB Messenger ID: ${senderId}`,
              source: "facebook",
            });
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[fb-webhook] Error processing Facebook webhook:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
