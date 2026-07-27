import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM crm_order_lists
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching order lists:', error);
    if (error.code === '42P01') {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { name } = body;

    await q(`
      CREATE TABLE IF NOT EXISTS crm_order_lists (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_order_lists (name) VALUES ($1) RETURNING *`,
      [name || 'New List']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating order list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
