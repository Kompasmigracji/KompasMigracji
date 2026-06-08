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

  /* ── Мок-режим: P24 не налаштований ─────────────────────────────── */
  if (isMockMode()) {
    const sessionId = `km-${randomUUID()}`;
    let appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://kompasmigracji.com').replace(/\/$/, '');
    if (appUrl && !appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      appUrl = `https://${appUrl}`;
    }

    /* Зберігаємо лід щоб mock-confirm міг оновити статус */
    await createLeadForPayment({ sessionId, description: String(description), email: String(email), source: leadSource, firstName: firstName ? String(firstName) : undefined, lastName: lastName ? String(lastName) : undefined, phone: phone ? String(phone) : undefined });

    const qs = new URLSearchParams({
      amount: String(amount),
      desc:   String(description),
      cur:    'PLN',
    }).toString();
    return NextResponse.json({ redirectUrl: `${appUrl}/payment/mock/${sessionId}?${qs}` });
  }

  /* ── Реальний P24 ────────────────────────────────────────────────── */
  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? '', 10);
  const crc        = process.env.P24_CRC!;
  const apiKey     = process.env.P24_API_KEY!;
  const sandbox    = process.env.P24_SANDBOX === 'true';
  const siteUrl    = (process.env.NEXT_PUBLIC_APP_URL || 'https://kompasmigracji.com').replace(/\/$/, '');

  const BASE = sandbox
    ? 'https://sandbox.przelewy24.pl'
    : 'https://secure.przelewy24.pl';

  const sessionId = `km-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  /* Зберігаємо лід і для реального P24 */
  await createLeadForPayment({ sessionId, description: String(description), email: String(email), source: leadSource, firstName: firstName ? String(firstName) : undefined, lastName: lastName ? String(lastName) : undefined, phone: phone ? String(phone) : undefined });

  const sign = crypto
    .createHash('sha384')
    .update(`${sessionId}|${merchantId}|${amount}|PLN|${crc}`)
    .digest('hex');

  const clientName = [firstName, lastName].filter(Boolean).map(String).join(' ').trim() || undefined;

  const payload = {
    merchantId,
    posId:       merchantId,
    sessionId,
    amount,
    currency:    'PLN',
    description,
    email,
    client:      clientName,
    phone:       phone ? String(phone) : undefined,
    country:     'PL',
    language:    lang === 'pl' ? 'pl' : 'uk',
    urlReturn:   `${siteUrl}/payment/success`,
    urlStatus:   `${siteUrl}/api/payment-notify`,
    timeLimit:   15,
    encoding:    'UTF-8',
    sign,
  };

  try {
    const r = await fetch(`${BASE}/api/v1/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${merchantId}:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok || !data?.data?.token) {
      console.error('P24 register error:', data);
      return NextResponse.json({ error: data?.error || 'Помилка платіжного шлюзу' }, { status: 502 });
    }

    return NextResponse.json({ redirectUrl: `${BASE}/trnRequest/${data.data.token}` });
  } catch (err) {
    console.error('Payment handler error:', err);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}
