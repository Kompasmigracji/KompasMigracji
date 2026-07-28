import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sourceMeta } from '@/lib/crm-chats';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`SELECT * FROM custom_chats ORDER BY created_at DESC LIMIT 300`);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching CRM chats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { name } = await req.json();
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'name required' }, { status: 400 });
    }

    const meta = sourceMeta('manual');
    const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const rows = await q(
      `INSERT INTO custom_chats (name, source, source_icon, source_color, last_message, time, unread, status)
       VALUES ($1, 'manual', $2, $3, 'Новий діалог створено вручну', $4, 0, 'open') RETURNING *`,
      [String(name).trim(), meta.icon, meta.color, timeStr]
    );
    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error creating CRM chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
