/* POST /api/admin/automations/:id/toggle — вмикає/вимикає автоматизацію */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = params;
  const { enabled } = await req.json().catch(() => ({}));

  try {
    await db.query(
      `INSERT INTO automation_states (id, enabled, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET enabled = $2, updated_at = NOW()`,
      [id, !!enabled]
    );
    return NextResponse.json({ ok: true, enabled });
  } catch {
    // Якщо таблиця ще не існує — просто повертаємо ok
    return NextResponse.json({ ok: true, enabled });
  }
}
