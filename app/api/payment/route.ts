import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  let body: { amount?: unknown; description?: unknown; email?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { amount, description, email, lang } = body;

  if (!amount || !description || !email) {
    return NextResponse.json({ error: 'Відсутні обов’язкові параметри' }, { status: 400 });
  }

  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? '', 10);
  const crc        = process.env.P24_CRC;
  const apiKey     = process.env.P24_API_KEY;
  const sandbox    = process.env.P24_SANDBOX === 'true';
  const siteUrl    = process.env.SITE_URL || 'https://kompasmigracji.com';

  if (!merchantId || !crc || !apiKey) {
    return NextResponse.json({ error: 'Платіжна система не налаштована' }, { status: 500 });
  }

  const BASE = sandbox
    ? 'https://sandbox.przelewy24.pl'
    : 'https://secure.przelewy24.pl';

  const sessionId = `km-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Исправлен формат подписи для Przelewy24 (v1)
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
    urlReturn: `${siteUrl}/payment-success?session=${encodeURIComponent(String(sessionId))}&desc=${encodeURIComponent(String(description))}`,
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
