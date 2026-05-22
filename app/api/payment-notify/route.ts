import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? '', 10);
  const crc = process.env.P24_CRC;
  const apiKey = process.env.P24_API_KEY;
  const sandbox = process.env.P24_SANDBOX === 'true';

  if (!merchantId || !crc || !apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { sessionId, orderId, amount, currency, sign } = body as Record<string, string | number>;

  // Verify incoming signature from Przelewy24
  const expectedSign = crypto
    .createHash('sha384')
    .update(JSON.stringify({ sessionId, orderId, amount, currency, crc }))
    .digest('hex');

  if (sign !== expectedSign) {
    console.error('P24 notify: invalid sign', { received: sign, expected: expectedSign });
    return NextResponse.json({ error: 'Invalid sign' }, { status: 400 });
  }

  const BASE = sandbox ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl';

  // Sign for the verification request
  const verifySign = crypto
    .createHash('sha384')
    .update(JSON.stringify({ sessionId, orderId, amount, currency, crc }))
    .digest('hex');

  try {
    const r = await fetch(`${BASE}/api/v1/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${merchantId}:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        merchantId,
        posId: merchantId,
        sessionId,
        amount,
        currency,
        orderId,
        sign: verifySign,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('P24 verify failed:', text);
      return NextResponse.json({ error: 'Verification failed' }, { status: 502 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('payment-notify error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
