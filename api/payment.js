import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, description, email, lang } = req.body;
  if (!amount || !description || !email) {
    return res.status(400).json({ error: 'Відсутні обовʼязкові параметри' });
  }

  const merchantId = parseInt(process.env.P24_MERCHANT_ID, 10);
  const crc        = process.env.P24_CRC;
  const apiKey     = process.env.P24_API_KEY;
  const sandbox    = process.env.P24_SANDBOX === 'true';
  const siteUrl    = process.env.SITE_URL || 'https://kompasmigracji.pl';

  if (!merchantId || !crc || !apiKey) {
    return res.status(500).json({ error: 'Платіжна система не налаштована' });
  }

  const BASE = sandbox
    ? 'https://sandbox.przelewy24.pl'
    : 'https://secure.przelewy24.pl';

  const sessionId = `km-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const sign = crypto
    .createHash('sha384')
    .update(JSON.stringify({ sessionId, merchantId, amount, currency: 'PLN', crc }))
    .digest('hex');

  const body = {
    merchantId,
    posId: merchantId,
    sessionId,
    amount,
    currency: 'PLN',
    description,
    email,
    country: 'PL',
    language: lang === 'pl' ? 'pl' : 'uk',
    urlReturn: `${siteUrl}/payment-success?session=${encodeURIComponent(sessionId)}&desc=${encodeURIComponent(description)}`,
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
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok || !data?.data?.token) {
      console.error('P24 register error:', data);
      return res.status(502).json({ error: data?.error || 'Помилка платіжного шлюзу' });
    }

    return res.json({ redirectUrl: `${BASE}/trnRequest/${data.data.token}` });
  } catch (err) {
    console.error('Payment handler error:', err);
    return res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
}
