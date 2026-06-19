export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { one, q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendWhatsApp } from "@/lib/whatsapp";
import { renderTemplate } from "@/lib/template-render";

const ADMIN_WA_PHONE = "48729417050";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Stripe webhook: missing signature or secret");
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const sessionId = session.metadata?.sessionId;
    const type = session.metadata?.type;
    const amountTotal = session.amount_total || 0;
    const currency = session.currency?.toUpperCase() || "PLN";
    
    // Save transaction for Architect Dashboard (Matrix)
    try {
      await q(
        `INSERT INTO transactions (amount, currency, status, source) VALUES ($1, $2, 'completed', $3)`,
        [amountTotal / 100, currency, type || 'payment']
      );
    } catch (e) {
      console.error("Failed to save transaction", e);
    }

    if (type === "subscription") {
      // Update subscription status
      try {
        await q(
          `UPDATE kompas_subscriptions SET status = 'active' WHERE session_id = $1`,
          [sessionId]
        );
      } catch (e) {
        console.error("Failed to update subscription status", e);
      }
    }

    if (sessionId) {
      // Find lead by session_id
      type LeadRow = { id: string; chat_id: number | null; first_name: string | null; service: string | null; contact: string | null; situation: string | null };
      let lead: LeadRow | null = null;
      try {
        lead = (await one(
          `SELECT id, chat_id, first_name, service, contact, situation
             FROM leads
            WHERE session_id = $1 AND deleted_at IS NULL
            LIMIT 1`,
          [sessionId],
        )) as LeadRow | null;
      } catch {
        console.warn("Stripe webhook: session_id column missing or not found");
      }

      if (lead) {
        /* ── Update Lead ─────────────────────────────────── */
        await q(
          `UPDATE leads SET paid_at = now(), status = 'closed' WHERE id = $1`,
          [lead.id],
        );

        /* ── Auto Telegram Message ────────────────── */
        if (lead.chat_id) {
          try {
            const tpl = (await one(
              `SELECT body FROM message_templates
                WHERE category = 'payment' AND auto_send = true
                ORDER BY sort_order ASC LIMIT 1`,
            )) as { body: string } | null;

            if (tpl) {
              const text = renderTemplate(tpl.body, {
                name:    lead.first_name ?? "клієнте",
                service: lead.service   ?? "",
                contact: "+48 729 271 848",
              });
              await sendMessage(lead.chat_id, text);
            } else {
              await sendMessage(
                lead.chat_id,
                `✅ <b>Оплату підтверджено!</b>\n\nДякуємо за довіру. Ваш менеджер зв'яжеться з вами найближчим часом.`,
              );
            }
          } catch (err) {}
        }

        /* ── Admin Notifications (Telegram + WhatsApp) ───────── */
        const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
        const amountFormatted = (amountTotal / 100).toFixed(2);

        const tgAdminText =
          `💳 <b>Нова оплата (Stripe)!</b>\n` +
          `👤 Клієнт: ${lead.first_name ?? "—"}\n` +
          (lead.contact   ? `📞 Телефон: ${lead.contact}\n`                  : "") +
          (lead.situation ? `📝 Послуга: ${lead.situation.split("\n")[0]}\n` : "") +
          (lead.service   ? `🏷 Сервіс: ${lead.service}\n`                   : "") +
          `💰 Сума: ${amountFormatted} ${currency}\n` +
          `🔑 Session: <code>${sessionId}</code>`;

        if (adminChat) {
          try { await sendMessage(adminChat, tgAdminText); } catch {}
        }

        try {
          const waText =
            `💳 Нова оплата (Stripe)!\n` +
            `Клієнт: ${lead.first_name ?? "—"}\n` +
            (lead.contact   ? `Телефон: ${lead.contact}\n`                  : "") +
            (lead.situation ? `Послуга: ${lead.situation.split("\n")[0]}\n` : "") +
            `Сума: ${amountFormatted} ${currency}`;
          await sendWhatsApp(ADMIN_WA_PHONE, waText);
        } catch {}
      } else {
        const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (adminChat) {
          try {
            await sendMessage(adminChat, `💳 Оплата Stripe отримана (лід не знайдено)\nSession: <code>${sessionId}</code>`);
          } catch {}
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
