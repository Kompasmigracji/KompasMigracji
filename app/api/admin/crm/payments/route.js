import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM crm_payments
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching payments:', error);
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
    const { amount, date, status } = body;
    
    await q(`
      CREATE TABLE IF NOT EXISTS crm_payments (
        id SERIAL PRIMARY KEY,
        amount NUMERIC DEFAULT 0,
        date TEXT,
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_payments (amount, date, status) VALUES ($1, $2, $3) RETURNING *`,
      [amount || 0, date || new Date().toISOString().split('T')[0], status || 'Pending']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
