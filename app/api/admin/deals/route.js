export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") || "";
  const assignedTo = parseInt(searchParams.get("assigned_to") || "0") || 0;

  try {
    const rows = await q(
      `SELECT 
        d.id, d.title, d.lead_id, d.member_id, d.assigned_to,
        d.stage, d.amount, d.currency, d.probability, d.expected_close,
        d.closed_at, d.notes, d.created_at, d.updated_at,
        l.name AS lead_name,
        l.contact AS lead_contact,
        u1.full_name AS assigned_to_name,
        u2.full_name AS member_name
      FROM kompas_deals d
      LEFT JOIN kompas_leads l ON l.id = d.lead_id
      LEFT JOIN kompas_users u1 ON u1.id = d.assigned_to
      LEFT JOIN kompas_users u2 ON u2.id = d.member_id
      WHERE ($1 = '' OR d.stage = $1)
        AND ($2 = 0 OR d.assigned_to = $2)
      ORDER BY d.expected_close ASC NULLS LAST, d.created_at DESC`,
      [stage, assignedTo]
    );

    return NextResponse.json({ deals: rows });
  } catch (err) {
    console.error("GET Deals error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  if (!b.title) {
    return NextResponse.json({ error: "Потрібна назва угоди" }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO kompas_deals (
        title, lead_id, member_id, assigned_to, stage, 
        amount, currency, probability, expected_close, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        b.title,
        b.lead_id ? parseInt(b.lead_id) : null,
        b.member_id ? parseInt(b.member_id) : null,
        b.assigned_to ? parseInt(b.assigned_to) : null,
        b.stage || 'prospecting',
        b.amount ? parseFloat(b.amount) : 0.00,
        b.currency || 'PLN',
        b.probability ? parseInt(b.probability) : 0,
        b.expected_close || null,
        b.notes || null
      ]
    );

    // Audit log
    await q(
      `INSERT INTO kompas_audit_log (user_id, action, entity, entity_id, meta)
       VALUES ($1, 'create', 'deal', $2, $3)`,
      [
        auth.user.id,
        row.id,
        JSON.stringify({ title: row.title, stage: row.stage, amount: row.amount })
      ]
    );

    return NextResponse.json({ deal: row }, { status: 201 });
  } catch (err) {
    console.error("POST Deal error:", err);
    return NextResponse.json({ error: "Помилка при створенні угоди" }, { status: 500 });
  }
}
