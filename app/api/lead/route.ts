import { NextRequest, NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { createTaskFromLead } from '@/lib/task-from-lead';

const CRM_SOURCES = ['bot', 'site', 'facebook', 'instagram', 'other'] as const;

export async function POST(req: NextRequest) {
  let body: {
    name?: string; phone?: string; source?: string;
    first_name?: string; contact?: string; service?: string; situation?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Normalize: orakul sends first_name+contact, chat-ai sends name+phone
  const firstName = ((body.first_name || body.name) ?? '').trim();
  const contact   = ((body.contact   || body.phone) ?? '').trim();
  const source    = body.source || 'site';
  const service   = (body.service   ?? '').trim();
  const situation = (body.situation ?? '').trim();

  if (!firstName || !contact) {
    return NextResponse.json({ error: 'name and contact required' }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO leads (first_name, contact, source, service, situation, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'new', NOW())
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [firstName, contact, source, service || null, situation || null],
    ) as { id: string } | null;

    // Mirror to kompas_leads so CRM admin panel shows all submissions
    const crmSource = (CRM_SOURCES as readonly string[]).includes(source) ? source : 'other';
    const message   = [service, situation].filter(Boolean).join(' — ') || null;
    await one(
      `INSERT INTO kompas_leads (source, name, contact, message, status)
       VALUES ($1, $2, $3, $4, 'new')`,
      [crmSource, firstName, contact, message],
    );

    if (row) {
      await createTaskFromLead({ name: firstName, contact, source });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'db error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
