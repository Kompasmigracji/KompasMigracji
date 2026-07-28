import { NextResponse } from 'next/server';
import { findOrCreateChat, appendMessage } from '@/lib/crm-chats';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'iphoenix_secure_token';

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
export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    console.error('WhatsApp Webhook Error:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
