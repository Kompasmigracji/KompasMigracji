import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
  }
  try {
    const { phone, platform, message, leadId } = await request.json();

    if (!phone || !message) {
      return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
    }

    // This is the outbound bot engine.
    // In production, this would call WhatsApp Business API (Twilio/Meta) or Telegram API.
    console.log(`[BOT OUTBOUND] Sending to ${phone} via ${platform || 'whatsapp'}: ${message}`);

    // Log the outbound message to the database chat history
    try {
      // Create chat if it doesn't exist
      const chatRes = await q('SELECT id FROM chats WHERE phone = $1', [phone]);
      let chatId;
      if (chatRes.length === 0) {
        const newChat = await q('INSERT INTO chats (phone, platform, lead_id) VALUES ($1, $2, $3) RETURNING id', [phone, platform || 'whatsapp', leadId]);
        chatId = newChat[0].id;
      } else {
        chatId = chatRes[0].id;
      }

      // Insert message
      await q('INSERT INTO chat_messages (chat_id, sender, text) VALUES ($1, $2, $3)', [chatId, 'bot', message]);
    } catch (e) {
      console.log('Chat logging failed, maybe tables do not exist yet. Ignoring.');
    }

    // Here you would integrate:
    // await twilioClient.messages.create({ body: message, from: 'whatsapp:+14155238886', to: `whatsapp:${phone}` });

    return NextResponse.json({ success: true, status: 'sent' });
  } catch (error: any) {
    console.error('Error sending bot message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
