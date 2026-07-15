export const dynamic = "force-dynamic";
// F2: Subscribe endpoint — creates subscription record + P24/PayU payment
// POST { planSlug, name, email, phone }
// Returns { redirectUrl } to checkout, or an error if no provider is available
// (mock checkout only outside production / P24_SANDBOX=mock — see mockModeAllowed below)
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";
import { createTaskFromLead } from "@/lib/task-from-lead";

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://www.kompasmigracji.com";

function mockModeAllowed(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.P24_SANDBOX === "mock";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planSlug = String(body.planSlug || "").toLowerCase().trim();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").toLowerCase().trim();
  const phone = String(body.phone || "").trim();

  if (!planSlug || !name || !email) {
    return NextResponse.json({ error: "planSlug, name and email required" }, { status: 400 });
  }

  // Load plan
  let plan;
  try {
    plan = await one(
      "SELECT * FROM kompas_subscription_plans WHERE slug=$1 AND is_active=true",
      [planSlug],
    );
  } catch (err: any) {
    console.error("[subscribe] plan lookup failed:", err.message);
  }

  if (!plan) {
    // Hardcoded fallback prices
    const PRICES: Record<string, { name: string; price: number }> = {
      basic: { name: "Basic", price: 49 },
      standard: { name: "Standard", price: 149 },
      premium: { name: "Premium", price: 349 },
    };
    plan = PRICES[planSlug] ? { slug: planSlug, name: PRICES[planSlug].name, price_pln: PRICES[planSlug].price } : null;
  }
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const sessionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 1);

  // Create subscription record (status=trial until payment confirmed)
  try {
    await q(
      `INSERT INTO kompas_subscriptions
        (plan_slug, plan_name, status, amount_pln, ends_at, next_billing_at, session_id, email, client_name)
       VALUES ($1,$2,'trial',$3,$4,$5,$6,$7,$8)`,
      [
        plan.slug, plan.name, plan.price_pln,
        endsAt, endsAt, sessionId, email, name,
      ],
    );
  } catch (err: any) {
    console.error("[subscribe] DB error:", err.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Also create a lead for CRM tracking
  try {
    await q(
      `INSERT INTO leads (first_name, contact, source, status, service, situation)
       VALUES ($1,$2,'subscription','new',$3,$4)`,
      [name, email + (phone ? " / " + phone : ""), plan.name, `Subskrypcja ${plan.name}`],
    );
    await createTaskFromLead({
      name,
      contact: email + (phone ? " / " + phone : ""),
      source: "subscription",
      service: plan.name,
      situation: `Subskrypcja ${plan.name}`,
    });
  } catch {}

  // F14: Send welcome email (non-blocking)
  if (email) {
    sendEmail(email, "Witamy w Kompas Migracji!", welcomeEmailHtml(name), "welcome").catch(() => {});
  }

  const amountGrosze = Math.round(Number(plan.price_pln) * 100);
  const description = `Subskrypcja ${plan.name} - Kompas Migracji`;

  // ── 1. Try Przelewy24 (primary — matches on-site branding) ──────────
  try {
    const { isP24Configured, registerTransaction, toP24Language } = await import("@/lib/przelewy24");
    if (isP24Configured()) {
      const result = await registerTransaction({
        sessionId,
        amount: amountGrosze,
        description,
        email,
        urlReturn: `${SITE}/payment/success?session=${sessionId}`,
        urlStatus: `${SITE}/api/payment-notify`,
        language: toP24Language(),
      });
      return NextResponse.json({ redirectUrl: result.paymentUrl, sessionId });
    }
  } catch (err: any) {
    console.error("[subscribe] P24 checkout error, trying PayU:", err.message);
  }

  // ── 2. Try PayU ───────────────────────────────────────────────────
  try {
    const { createPayUOrder, isPayUConfigured } = await import("@/lib/payu");
    if (isPayUConfigured()) {
      const result = await createPayUOrder({
        sessionId,
        amount: amountGrosze,
        description,
        email,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        phone,
        notifyUrl: `${SITE}/api/payu/notify`,
        continueUrl: `${SITE}/payment/success?session=${sessionId}`,
      });
      return NextResponse.json({ redirectUrl: result.redirectUrl, sessionId: result.orderId });
    }
  } catch (err: any) {
    console.error("[subscribe] PayU checkout error:", err.message);
  }

  // ── 3. No provider available ──────────────────────────────────────
  if (mockModeAllowed()) {
    const params = new URLSearchParams({
      session: sessionId,
      amount: String(amountGrosze),
      desc: encodeURIComponent(description),
      email,
      name,
    });
    return NextResponse.json({
      redirectUrl: `${SITE}/payment/mock/${sessionId}?${params}`,
      sessionId,
    });
  }

  console.error("[subscribe] no payment provider available for session", sessionId);
  return NextResponse.json(
    {
      error:
        "Оплата тимчасово недоступна. Ми вже отримали вашу заявку — менеджер зв'яжеться з вами найближчим часом, щоб оформити підписку іншим способом.",
    },
    { status: 502 },
  );
}
