export const maxDuration = 300;
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { findOrCreateChat, appendMessage } from '@/lib/crm-chats';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';

/* Meta signs every webhook POST with X-Hub-Signature-256 (HMAC-SHA256 of the raw
   body, keyed by the Meta App Secret — shared by WhatsApp Cloud API and Messenger).
   Without checking it, anyone who finds this URL can POST a fake incoming-message
   payload for any phone number and have it written straight into the CRM inbox. */
function verifyMetaSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
  const sigBuf = Buffer.from(signatureHeader);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

// VERIFICATION ENDPOINT FOR META
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse('Bad Request', { status: 400 });
}

// INCOMING MESSAGES ENDPOINT
export async function POST(request: NextRequest) {
  const rl = rateLimit(clientIp(request), { max: 30, windowMs: 60_000, ns: 'whatsapp-webhook' });
  if (!rl.ok) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  try {
    const rawBody = await request.text();
    const appSecret = process.env.FB_APP_SECRET;
    if (appSecret) {
      const signature = request.headers.get('x-hub-signature-256');
      if (!verifyMetaSignature(rawBody, signature, appSecret)) {
        console.warn('[whatsapp] Rejected webhook: invalid X-Hub-Signature-256');
        return new NextResponse('Forbidden', { status: 403 });
      }
    } else {
      console.warn('[whatsapp] FB_APP_SECRET not configured — webhook signature NOT verified');
    }

    const body = JSON.parse(rawBody);

    if (!body.object) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (message?.from && message.text?.body) {
      const phoneNumber: string = message.from;
      const msgBody: string = message.text.body;
      const contactName: string | undefined = value?.contacts?.[0]?.profile?.name;

      console.log(`[WHATSAPP] Message from ${phoneNumber}: ${msgBody}`);

      try {
        const chatId = await findOrCreateChat('whatsapp', phoneNumber, contactName || phoneNumber);
        await appendMessage(chatId, msgBody, 'client');
      } catch (e) {
        console.error('[whatsapp] CRM chat mirror failed:', e);
      }

      // Save lead + notify admin
      try {
        const { q } = await import('@/lib/db');
        await q(
          `INSERT INTO kompas_leads (source, name, contact, message, status)
           VALUES ('whatsapp', $1, $2, $3, 'new') ON CONFLICT DO NOTHING`,
          [contactName || phoneNumber, phoneNumber, msgBody.slice(0, 500)]
        );
        const { notifyAdmin } = await import('@/lib/telegram');
        await notifyAdmin(
          `💬 <b>WhatsApp — нове повідомлення</b>\nВід: <b>${contactName || phoneNumber}</b>\nТел: ${phoneNumber}\n${msgBody.slice(0, 300)}`
        );
      } catch (e) {
        console.error('[whatsapp] lead/notify error:', e);
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    console.error('WhatsApp Webhook Error:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
