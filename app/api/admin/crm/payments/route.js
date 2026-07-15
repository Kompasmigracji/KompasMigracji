import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM custom_payments
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { type, description, amount, currency } = body;

    const typeLabel = type === 'income' ? 'Надходження' : 'Списання';

    const result = await one(
      `INSERT INTO custom_payments (type, type_label, description, manager, amount, currency, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        type || 'income',
        typeLabel,
        description || '',
        auth.user.name || auth.user.email || 'Адміністратор',
        amount || 0,
        currency || 'PLN',
        'paid'
      ]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
