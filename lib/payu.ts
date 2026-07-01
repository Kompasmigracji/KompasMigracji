/* lib/payu.ts — PayU REST API integration
   Docs: https://developers.payu.com/europe/docs/
   OAuth2 token + CreateOrder + IPN notify
*/

const PAYU_BASE = process.env.PAYU_SANDBOX === 'true'
  ? 'https://secure.snd.payu.com'
  : 'https://secure.payu.com';

const POS_ID          = process.env.PAYU_POS_ID ?? '';
const OAUTH_CLIENT_ID = process.env.PAYU_OAUTH_CLIENT_ID ?? '';
const OAUTH_SECRET    = process.env.PAYU_OAUTH_CLIENT_SECRET ?? '';
const MD5_KEY         = process.env.PAYU_MD5_KEY ?? '';

export function isPayUConfigured(): boolean {
  return !!(POS_ID && OAUTH_CLIENT_ID && OAUTH_SECRET && MD5_KEY);
}

/** Отримати OAuth2 Bearer токен від PayU */
async function getAccessToken(): Promise<string> {
  const res = await fetch(`${PAYU_BASE}/pl/standard/user/oauth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     OAUTH_CLIENT_ID,
      client_secret: OAUTH_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`PayU auth failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

export interface PayUOrderOptions {
  sessionId:   string;
  amount:      number;      // в грошах (grosze), напр. 5000 = 50 PLN
  description: string;
  email:       string;
  firstName?:  string;
  lastName?:   string;
  phone?:      string;
  lang?:       string;
  notifyUrl:   string;
  continueUrl: string;
}

export interface PayUOrderResult {
  redirectUrl: string;
  orderId:     string;
}

/** Створити замовлення в PayU і отримати URL для редиректу клієнта */
export async function createPayUOrder(opts: PayUOrderOptions): Promise<PayUOrderResult> {
  const token = await getAccessToken();

  const payload = {
    notifyUrl:   opts.notifyUrl,
    continueUrl: opts.continueUrl,
    customerIp:  '127.0.0.1', // буде overridden PayU
    merchantPosId: POS_ID,
    description:   opts.description,
    currencyCode:  'PLN',
    totalAmount:   String(opts.amount),
    extOrderId:    opts.sessionId,
    buyer: {
      email:     opts.email,
      firstName: opts.firstName ?? '',
      lastName:  opts.lastName  ?? '',
      phone:     opts.phone     ?? '',
      language:  opts.lang      ?? 'pl',
    },
    products: [
      {
        name:      opts.description,
        unitPrice: String(opts.amount),
        quantity:  '1',
      },
    ],
  };

  const res = await fetch(`${PAYU_BASE}/api/v2_1/orders`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    redirect: 'manual', // PayU повертає 302 з redirectUri
  });

  // PayU повертає 302 redirect з Location: redirectUri
  if (res.status === 302) {
    const location = res.headers.get('location') ?? '';
    // Знайти orderId з тіла (якщо є)
    let orderId = opts.sessionId;
    try {
      const text = await res.text();
      const data = JSON.parse(text);
      orderId = data.orderId ?? orderId;
    } catch {}
    return { redirectUrl: location, orderId };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayU createOrder failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    redirectUrl: data.redirectUri ?? data.redirectUrl ?? '',
    orderId:     data.orderId ?? opts.sessionId,
  };
}

import crypto from 'crypto';

/** Перевірка підпису IPN-нотифікації від PayU (MD5 signature)
    Header: OpenPayu-Signature: signature=xxx;algorithm=MD5
 */
export function verifyPayUSignature(
  body:      string,
  headerVal: string | null,
): boolean {
  if (!headerVal) return false;

  // Parse header: key=value;key=value
  const parts = Object.fromEntries(
    headerVal.split(';').map(p => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=').trim()];
    })
  );

  const received  = parts['signature'];
  const algorithm = (parts['algorithm'] ?? 'MD5').toUpperCase();

  if (algorithm !== 'MD5') return false; // only MD5 supported here

  const expected = crypto
    .createHash('md5')
    .update(body + MD5_KEY)
    .digest('hex');

  return received === expected;
}
