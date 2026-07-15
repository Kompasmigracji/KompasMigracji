import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { user } = auth;

    const timestamp = new Date().toISOString();

    // 1. Create a test lead in the live `leads` table — the same table
    //    backing /admin/crm/leads and /admin/crm/funnels, so the test
    //    actually exercises the pipeline the CRM UI shows.
    const newLead = await one(`
      INSERT INTO leads (name, contact, message, source, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      "[TEST] Автоматизація Sandbox",
      "+48000000000",
      "Тестовий запит з Пісочниці",
      "sandbox",
      "new",
    ]);

    const leadId = newLead.id;

    // 2. Generate fake payment link
    const paymentToken = `tok_${Math.random().toString(36).substring(2, 10)}`;

    // 3. Move lead to 'won' — mirrors a successful conversion
    await q(`UPDATE leads SET status = 'won' WHERE id = $1`, [leadId]);

    // 4. Create a real follow-up task, visible in /admin/crm/tasks
    await q(`
      INSERT INTO tasks (title, description, category, stage, priority, assigned_to, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      "[TEST] Надіслати документи клієнту",
      "Автоматично створено E2E-пісочницею",
      "general",
      "todo",
      "normal",
      user.sub || null,
      user.sub || null,
    ]);

    return NextResponse.json({
      ok: true,
      leadId,
      paymentToken,
      timestamp
    });

  } catch (error) {
    console.error("Automation test error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
