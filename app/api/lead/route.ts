import { NextRequest, NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { createTaskFromLead } from '@/lib/task-from-lead';

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, phone, source = 'chat-ai' } = body;
  if (!name || !phone) {
    return NextResponse.json({ error: 'name and phone required' }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO leads (first_name, contact, source, status, created_at)
       VALUES ($1, $2, $3, 'new', NOW())
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [name.trim(), phone.trim(), source],
    ) as { id: string } | null;

    if (row) {
      await createTaskFromLead({ name, contact: phone, source });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'db error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
