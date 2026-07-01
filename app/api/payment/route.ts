export const dynamic = "force-dynamic";
/* /api/payment — публічний ендпоінт для P24-оплати з сайту (pricing, karta тощо).
   Коли P24 не налаштований — автоматично повертає мок-URL для тестів.
   При реєстрації платежу створює лід у БД (щоб mock-confirm міг його оновити). */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { randomUUID } from 'crypto';
import { q } from '@/lib/db';
import { createTaskFromLead } from '@/lib/task-from-lead';

function isMockMode(): boolean {
  const mid = parseInt(process.env.P24_MERCHANT_ID ?? '', 10);
  return (
    process.env.P24_SANDBOX === 'mock' ||
    !mid || mid === 0 ||
    !process.env.P24_CRC ||
    !process.env.P24_API_KEY
  );
}

/** Зберігає лід у БД з session_id щоб payment-mock-confirm міг його знайти */
async function createLeadForPayment(opts: {
  sessionId: string;
  description: string;
  email: string;
  source: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<void> {
  try {
    const { sessionId, description, email, source, firstName, lastName, phone } = opts;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
    /* contact = телефон (відображається в колонці "Контакт" CRM)
       situation = опис + email (відображається в колонці "Повідомлення" CRM) */
    const situation = `${description}\n📧 ${email}`;
    await q(
      `INSERT INTO leads (first_name, contact, situation, source, session_id, status)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [fullName, phone || null, situation, source, sessionId],
    );
    await createTaskFromLead({ name: fullName, contact: phone, source, situation: description });
  } catch (err) {
    // Не блокуємо платіж якщо запис ліда не вдався
    console.error('payment/route: failed to create lead', err);
  }
}

export async function POST(req: NextRequest) {
  let body: { amount?: unknown; description?: unknown; email?: unknown; lang?: unknown; source?: unknown; firstName?: unknown; lastName?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { amount, description, email, lang, source, firstName, lastName, phone } = body;

  if (!amount || !description || !email) {
    return NextResponse.json({ error: 'Відсутні обов\'язкові параметри' }, { status: 400 });
  }

  const leadSource = String(source || 'pricing');
  const sessionId  = `km-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const siteUrl    = (process.env.NEXT_PUBLIC_APP_URL || 'https://kompasmigracji.com').replace(/\/$/, '');

  /* ── 1. Try PayU ─────────────────────────────────────────────────── */
  try {
    const { isPayUConfigured, createPayUOrder } = await import('@/lib/payu');
    if (isPayUConfigured()) {
      await createLeadForPayment({
        sessionId,
        description: String(description),
        email:       String(email),
        source:      leadSource,
        firstName:   firstName ? String(firstName) : undefined,
        lastName:    lastName  ? String(lastName)  : undefined,
        phone:       phone     ? String(phone)     : undefined,
      });

      const result = await createPayUOrder({
        sessionId,
        amount:      Number(amount),
        description: String(description),
        email:       String(email),
        firstName:   firstName ? String(firstName) : undefined,
        lastName:    lastName  ? String(lastName)  : undefined,
        phone:       phone     ? String(phone)     : undefined,
        lang:        lang      ? String(lang)      : 'pl',
        notifyUrl:   `${siteUrl}/api/payu/notify`,
        continueUrl: `${siteUrl}/payment/success`,
      });

      return NextResponse.json({ redirectUrl: result.redirectUrl });
    }
  } catch (err) {
    console.error('PayU handler error, trying Stripe:', err);
  }

  /* ── 2. Try Stripe Checkout ──────────────────────────────────────── */
  try {
    const { stripe } = await import('@/lib/stripe');
    if (stripe) {
      await createLeadForPayment({
        sessionId,
        description: String(description),
        email:       String(email),
        source:      leadSource,
        firstName:   firstName ? String(firstName) : undefined,
        lastName:    lastName  ? String(lastName)  : undefined,
        phone:       phone     ? String(phone)     : undefined,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'p24', 'blik'],
        line_items: [{
          price_data: {
            currency: 'pln',
            product_data: { name: String(description) },
            unit_amount: Number(amount),
          },
          quantity: 1,
        }],
        mode:             'payment',
        success_url:      `${siteUrl}/payment/success`,
        cancel_url:       `${siteUrl}/test/pricing`,
        customer_email:   String(email),
        client_reference_id: sessionId,
        metadata: { sessionId, source: leadSource },
      });

      return NextResponse.json({ redirectUrl: session.url });
    }
  } catch (err) {
    console.error('Stripe handler error, falling back to mock:', err);
  }

  /* ── 3. Mock mode ────────────────────────────────────────────────── */
  const mockSessionId = `km-${randomUUID()}`;
  let appUrl = siteUrl;
  if (appUrl && !appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
    appUrl = `https://${appUrl}`;
  }

  await createLeadForPayment({
    sessionId:   mockSessionId,
    description: String(description),
    email:       String(email),
    source:      leadSource,
    firstName:   firstName ? String(firstName) : undefined,
    lastName:    lastName  ? String(lastName)  : undefined,
    phone:       phone     ? String(phone)     : undefined,
  });

  const qs = new URLSearchParams({
    amount: String(amount),
    desc:   String(description),
    cur:    'PLN',
  }).toString();
  return NextResponse.json({ redirectUrl: `${appUrl}/payment/mock/${mockSessionId}?${qs}` });
}
