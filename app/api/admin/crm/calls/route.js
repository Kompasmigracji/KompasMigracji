import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT c.*, l.name AS lead_name
      FROM crm_calls c
      LEFT JOIN leads l ON l.id = c.lead_id
      ORDER BY c.created_at DESC
      LIMIT 200
    `);
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching calls:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { lead_id, direction, phone, duration_seconds, outcome, notes } = body;

    const result = await one(
      `INSERT INTO crm_calls (lead_id, direction, phone, duration_seconds, outcome, notes, manager_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        lead_id || null,
        direction === 'incoming' ? 'incoming' : 'outgoing',
        phone || null,
        Number(duration_seconds) || 0,
        outcome || 'answered',
        notes || null,
        auth.user.name || auth.user.email || 'Менеджер'
      ]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
