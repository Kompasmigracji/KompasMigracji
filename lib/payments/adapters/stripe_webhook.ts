export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { stripe } from "@/lib/stripe";
import { one, q } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";
import { sendWhatsApp } from "@/lib/whatsapp";
import { renderTemplate } from "@/lib/template-render";
import { markLeadPaid } from "@/lib/lead-payment-sync";

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
    Sentry.captureException(err);
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
      Sentry.captureException(e);
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
        Sentry.captureException(e);
      }
    }

    if (type === "architecture") {
      /* checkout-architecture/route.ts builds this session with no linked `leads`
         row (the architecture landing page captures name/phone separately via
         /api/architecture/lead, before Stripe even runs) — so the sessionId-based
         `leads` lookup below would never find anything for these purchases. Mirror
         the purchase straight into kompas_leads (same shape as createLeadForPayment
         in app/api/payment/route.ts) so it's visible in the CRM funnel, and notify
         admin the same way the other payment paths do. */
      const packageId = session.metadata?.packageId;
      const packageName = session.metadata?.packageName || packageId || "Architecture";
      const customerEmail: string | null = session.customer_details?.email || session.customer_email || null;
      const customerName: string | null = session.customer_details?.name || null;
      const amountFormattedArch = (amountTotal / 100).toFixed(2);

      try {
        await q(
          `INSERT INTO kompas_leads (source, name, email, message, status)
           VALUES ($1, $2, $3, $4, 'won')`,
          ["other", customerName, customerEmail, `Архітектура: ${packageName} — ${amountFormattedArch} ${currency}`],
        );
      } catch (e) {
        console.error("Failed to record architecture purchase in kompas_leads", e);
        Sentry.captureException(e);
      }

      const archAdminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
      const archAdminText =
        `💳 <b>Нова оплата (Architecture)!</b>\n` +
        `📦 Пакет: ${packageName}\n` +
        (customerName  ? `👤 Клієнт: ${customerName}\n`  : "") +
        (customerEmail ? `📧 Email: ${customerEmail}\n`  : "") +
        `💰 Сума: ${amountFormattedArch} ${currency}\n` +
        `🔑 Session: <code>${session.id}</code>`;

      if (archAdminChat) {
        try { await sendMessage(archAdminChat, archAdminText); } catch {}
      }
      try {
        await sendWhatsApp(ADMIN_WA_PHONE, archAdminText.replace(/<[^>]+>/g, ""));
      } catch {}

      return NextResponse.json({ received: true });
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
        /* ── Update Lead (і дзеркального kompas_leads) ─────────── */
        const { alreadyPaid } = await markLeadPaid(lead.id);
        if (alreadyPaid) {
          return NextResponse.json({ received: true });
        }

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
