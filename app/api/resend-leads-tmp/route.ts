export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { q } from '@/lib/db';

export async function GET() {
  try {
    const rows = await q(`
      SELECT p.amount_grosz, p.session_id, l.first_name, l.contact, l.email, l.situation, l.service, p.created_at
      FROM kompas_payments p
      LEFT JOIN leads l ON l.session_id = p.session_id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);
    return NextResponse.json({ success: true, payments: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
