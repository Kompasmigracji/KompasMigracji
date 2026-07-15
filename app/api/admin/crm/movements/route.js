import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM crm_movements
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching movements:', error);
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
    const { type, item, qty } = body;
    
    await q(`
      CREATE TABLE IF NOT EXISTS crm_movements (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        item TEXT NOT NULL,
        qty INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_movements (type, item, qty) VALUES ($1, $2, $3) RETURNING *`,
      [type || 'Unknown', item || 'Unknown', qty || 0]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating movement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
