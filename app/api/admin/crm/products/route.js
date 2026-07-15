import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT * FROM products
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { name, category, price, qty_in_stock } = body;

    if (!name) {
      return NextResponse.json({ error: 'Назва обов\'язкова' }, { status: 400 });
    }

    const result = await one(
      `INSERT INTO products (name, category, price, qty_in_stock) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, category || null, price || 0, qty_in_stock || 0]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
