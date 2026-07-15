import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM crm_calls
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching calls:', error);
    if (error.code === '42P01') {
      // Table does not exist
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
    const { from_number, duration, time } = body;
    
    // Auto-create table if missing (for easy setup)
    await q(`
      CREATE TABLE IF NOT EXISTS crm_calls (
        id SERIAL PRIMARY KEY,
        from_number TEXT,
        duration TEXT,
        time TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_calls (from_number, duration, time) VALUES ($1, $2, $3) RETURNING *`,
      [from_number || '', duration || '', time || '']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
