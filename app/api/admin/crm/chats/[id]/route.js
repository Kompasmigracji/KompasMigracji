import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { status } = await req.json();
    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'status must be open or closed' }, { status: 400 });
    }

    const rows = await q(
      `UPDATE custom_chats SET status = $1 WHERE id = $2 RETURNING *`,
      [status, params.id]
    );
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error updating CRM chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
