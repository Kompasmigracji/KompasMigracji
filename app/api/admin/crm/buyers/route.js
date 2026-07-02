import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'manager', 'partner'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await db.query(`
      SELECT b.id, b.full_name, b.phone, b.email, b.created_at, s.name as source_name 
      FROM buyers b
      LEFT JOIN sources s ON b.source_id = s.id
      ORDER BY b.created_at DESC
    `);
    
    // Map to the expected format for the frontend
    const buyers = res.rows.map(r => ({
      id: r.id,
      full_name: r.full_name,
      email: r.email,
      phone: r.phone,
      source: r.source_name || 'Manual',
      created_at: r.created_at
    }));

    return NextResponse.json({ data: buyers });
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'manager', 'partner'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, email, phone } = await req.json();

    if (!full_name || (!email && !phone)) {
      return NextResponse.json({ error: 'Name and either email or phone are required.' }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO buyers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
      [full_name, email || null, phone || null]
    );

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating buyer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
