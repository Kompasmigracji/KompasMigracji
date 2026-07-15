import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM crm_publications
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching publications:', error);
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
    const { title, status } = body;
    
    await q(`
      CREATE TABLE IF NOT EXISTS crm_publications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_publications (title, status) VALUES ($1, $2) RETURNING *`,
      [title || 'New Publication', status || 'Draft']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
