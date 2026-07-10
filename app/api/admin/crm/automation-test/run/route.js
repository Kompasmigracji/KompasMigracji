import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function POST(req) {
  try {
    // Basic auth check
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const timestamp = new Date().toISOString();

    // 1. Create a Test Lead
    const newLead = await one(`
      INSERT INTO kompas_leads (first_name, service, contact, situation, source, status, score, assigned_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      "[TEST] Олександр Автоматизація", 
      "Швидка Консультація", 
      "+48000000000", 
      "Тестовий запит з Пісочниці", 
      "sandbox", 
      "new", 
      100, // High score
      user.id
    ]);

    const leadId = newLead.id;

    // 2. Generate Fake Payment Link
    const paymentToken = `tok_${Math.random().toString(36).substring(2, 10)}`;

    // 3. Move Lead to 'Won' (Converted)
    await q(`UPDATE kompas_leads SET status = 'won' WHERE id = $1`, [leadId]);

    // 4. Create Buyer
    await one(`
      INSERT INTO buyers (full_name, phone, email) 
      VALUES ($1, $2, $3)
      RETURNING id
    `, ["[TEST] Олександр Автоматизація", "+48000000000", "test@sandbox.local"]);

    // 5. Create Task (Case)
    await q(`
      INSERT INTO kompas_cases (title, client_id, status, assigned_to)
      VALUES ($1, $2, $3, $4)
    `, [
      "[TEST] Надіслати документи клієнту",
      leadId,
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
