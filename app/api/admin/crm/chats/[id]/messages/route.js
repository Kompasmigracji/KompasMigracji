import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendMessage as sendTelegramMessage } from '@/lib/telegram';
import { sendWhatsAppText } from '@/lib/whatsapp';
import { sendViberMessage } from '@/lib/viber';

export async function GET(req, { params }) {
  try {
    const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(
      `SELECT * FROM custom_messages WHERE chat_id = $1 ORDER BY created_at ASC`,
      [params.id]
    );
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching CRM chat messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** Dispatch an outbound reply through the chat's real channel. No-op for manual chats. */
async function dispatchOutbound(chat, text) {
  if (!chat.external_id) return { ok: true };
  switch (chat.source) {
    case 'telegram':
      await sendTelegramMessage(chat.external_id, text, 'HTML');
      return { ok: true };
    case 'whatsapp':
      return sendWhatsAppText(chat.external_id, text);
    case 'viber':
      return sendViberMessage(chat.external_id, text);
    default:
      return { ok: true };
  }
}

export async function POST(req, { params }) {
  try {
    const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { text } = await req.json();
    if (!text || !String(text).trim()) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }
    const msgText = String(text).trim();

    const chat = await one(`SELECT * FROM custom_chats WHERE id = $1`, [params.id]);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    const send = await dispatchOutbound(chat, msgText);

    const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const inserted = await one(
      `INSERT INTO custom_messages (chat_id, text, time, sender, is_seen) VALUES ($1, $2, $3, 'manager', true) RETURNING *`,
      [params.id, msgText, timeStr]
    );
    await q(
      `UPDATE custom_chats SET last_message = $1, time = $2 WHERE id = $3`,
      [msgText, timeStr, params.id]
    );

    return NextResponse.json({ data: inserted, delivery: send });
  } catch (error) {
    console.error('Error sending CRM chat message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
