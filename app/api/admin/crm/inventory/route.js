import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';

export async function GET() {
  try {
    const rows = await q(`
      SELECT * FROM crm_inventory
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    if (error.code === '42P01') {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { item, quantity } = body;
    
    await q(`
      CREATE TABLE IF NOT EXISTS crm_inventory (
        id SERIAL PRIMARY KEY,
        item TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await one(
      `INSERT INTO crm_inventory (item, quantity) VALUES ($1, $2) RETURNING *`,
      [item || 'New Item', quantity || 0]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
