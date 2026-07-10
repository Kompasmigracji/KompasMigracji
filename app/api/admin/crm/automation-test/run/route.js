import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export async function POST(req) {
  try {
    // Basic auth check
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const timestamp = new Date().toISOString();

    // 1. Create a Test Lead
    const newLead = await one(`
      INSERT INTO kompas_leads (name, contact, message, source, status, assigned_to)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      "[TEST] Олександр Автоматизація", 
      "+48000000000", 
      "Тестовий запит з Пісочниці", 
      "bot", 
      "new", 
      user.id
    ]);

    const leadId = newLead.id;

    // 2. Generate Fake Payment Link
    const paymentToken = `tok_${Math.random().toString(36).substring(2, 10)}`;

    // 3. Move Lead to 'converted' (status in check constraint: 'new','in_progress','converted','closed')
    await q(`UPDATE kompas_leads SET status = 'converted' WHERE id = $1`, [leadId]);

    // 4. Skip Create Buyer (table might not exist in sandbox or schema)
    // await one(`INSERT INTO buyers ...`);

    // 5. Create Task (Case) — kompas_cases has user_id not client_id, status must be 'open','in_progress','resolved','closed'
    await q(`
      INSERT INTO kompas_cases (title, user_id, status, assigned_to)
      VALUES ($1, $2, $3, $4)
    `, [
      "[TEST] Надіслати документи клієнту",
      user.id,
      "open",
      user.id
    ]);

    // Return the generated data to the frontend
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
