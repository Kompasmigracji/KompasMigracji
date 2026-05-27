/* /api/payment — публічний ендпоінт для P24-оплати з сайту (pricing, karta тощо).
   Коли P24 не налаштований — автоматично повертає мок-URL для тестів. */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { randomUUID } from 'crypto';

function isMockMode(): boolean {
  const mid = parseInt(process.env.P24_MERCHANT_ID ?? '', 10);
  return (
    process.env.P24_SANDBOX === 'mock' ||
    !mid || mid === 0 ||
    !process.env.P24_CRC ||
    !process.env.P24_API_KEY
  );
}

export async function POST(req: NextRequest) {
  let body: { amount?: unknown; description?: unknown; email?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { amount, description, email, lang } = body;

  if (!amount || !description || !email) {
    return NextResponse.json({ error: 'Відсутні обов\'язкові параметри' }, { status: 400 });
  }

  /* ── Мок-режим: P24 не налаштований ─────────────────────────────── */
  if (isMockMode()) {
    const sessionId = `km-${randomUUID()}`;
    let appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://kompasmigracji.com').replace(/\/$/, '');
    if (appUrl && !appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      appUrl = `https://${appUrl}`;
    }
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

  const sign = crypto
    .createHash('sha384')
    .update(`${sessionId}|${merchantId}|${amount}|PLN|${crc}`)
    .digest('hex');

  const payload = {
    merchantId,
    posId: merchantId,
    sessionId,
    amount,
    currency: 'PLN',
    description,
    email,
    country: 'PL',
    language: lang === 'pl' ? 'pl' : 'uk',
    urlReturn: `${siteUrl}/payment/success`,
    urlStatus: `${siteUrl}/api/payment-notify`,
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
