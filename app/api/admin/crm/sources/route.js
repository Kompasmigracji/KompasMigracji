import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q('SELECT * FROM sources ORDER BY created_at DESC');
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { name, type } = body;
    if (!name) return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 });

    const result = await one(
      `INSERT INTO sources (name, type, status) VALUES ($1, $2, true) RETURNING *`,
      [name, type || 'manual']
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ error: "ID обов'язковий" }, { status: 400 });

    const result = await one(
      `UPDATE sources SET status = $1 WHERE id = $2 RETURNING *`,
      [!!status, id]
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await q('DELETE FROM sources WHERE id = $1', [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
