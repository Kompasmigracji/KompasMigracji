import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';

export async function GET() {
  try {
    const rows = await q(`
      SELECT * FROM crm_chats
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching chats:', error);
    if (error.code === '42P01') {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_name, last_message, time } = body;
    
    await q(`
      CREATE TABLE IF NOT EXISTS crm_chats (
        id SERIAL PRIMARY KEY,
        user_name TEXT,
        last_message TEXT,
        time TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_chats (user_name, last_message, time) VALUES ($1, $2, $3) RETURNING *`,
      [user_name || '', last_message || '', time || '']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
