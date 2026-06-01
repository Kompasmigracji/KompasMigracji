import { NextRequest, NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { createTaskFromLead } from '@/lib/task-from-lead';

const CRM_SOURCES = ['bot', 'site', 'facebook', 'instagram', 'other'] as const;

export async function POST(req: NextRequest) {
  let body: {
    name?: string; phone?: string; source?: string;
    first_name?: string; contact?: string; service?: string;
    situation?: string; email?: string; message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = ((body.first_name || body.name) ?? '').trim();
  const contact   = ((body.contact   || body.phone) ?? '').trim();
  const source    = body.source    || 'site';
  const service   = (body.service   ?? '').trim();
  const situation = (body.situation ?? '').trim();
  const email     = (body.email    ?? '').trim();
  const message   = (body.message  ?? '').trim();

  if (!firstName || !contact) {
    return NextResponse.json({ error: 'name and contact required' }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO leads (first_name, contact, source, service, situation, email, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', NOW())
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [firstName, contact, source, service || null, situation || null, email || null, message || null],
    ) as { id: string } | null;

    // Mirror to kompas_leads for CRM admin panel
    const crmSource  = (CRM_SOURCES as readonly string[]).includes(source) ? source : 'other';
    const crmMessage = [service, situation, message].filter(Boolean).join('\n') || null;
    await one(
      `INSERT INTO kompas_leads (source, name, contact, email, message, status)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [crmSource, firstName, contact, email || null, crmMessage],
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
