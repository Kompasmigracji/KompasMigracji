import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';

export async function GET() {
  try {
    const rows = await q(`
      SELECT b.id, b.full_name, b.phone, b.email, b.created_at, s.name as source_name 
      FROM buyers b
      LEFT JOIN sources s ON b.source_id = s.id
      ORDER BY b.created_at DESC
    `);
    
    // Map to the expected format for the frontend
    const mapped = rows.map(r => ({
      id: r.id,
      full_name: r.full_name,
      email: r.email,
      phone: r.phone,
      source: r.source_name || 'Manual',
      created_at: r.created_at
    }));

    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { full_name, email, phone } = await req.json();

    if (!full_name || (!email && !phone)) {
      return NextResponse.json({ error: 'Name and either email or phone are required.' }, { status: 400 });
    }

    const result = await one(
      `INSERT INTO buyers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
      [full_name, email || null, phone || null]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating buyer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
