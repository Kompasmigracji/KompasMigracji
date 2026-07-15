import { NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const row = await one('SELECT * FROM crm_settings WHERE id = 1');
    return NextResponse.json({ data: row });
  } catch (error) {
    console.error('Error fetching CRM settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { company_name, country, timezone, logo_url } = body;

    const row = await one(
      `UPDATE crm_settings SET
         company_name = COALESCE($1, company_name),
         country = COALESCE($2, country),
         timezone = COALESCE($3, timezone),
         logo_url = $4,
         updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [company_name || null, country || null, timezone || null, logo_url || null]
    );

    return NextResponse.json({ ok: true, data: row });
  } catch (error) {
    console.error('Error updating CRM settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
