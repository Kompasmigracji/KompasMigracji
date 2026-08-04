export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const workerId = parseInt(searchParams.get("worker_id") || "0") || 0;

  try {
    const rows = await q(
      `SELECT
         c.id, c.lead_id, c.client_full_name, c.client_contact, c.contract_type,
         c.title, c.value_pln, c.currency, c.status, c.signed_date, c.valid_from,
         c.valid_until, c.assigned_to, c.notes, c.created_at, c.updated_at,
         u.full_name AS assigned_to_name
       FROM contracts c
       LEFT JOIN kompas_users u ON u.id = c.assigned_to
       WHERE ($1 = '' OR c.status = $1)
         AND ($2 = '' OR c.contract_type = $2)
         AND ($3 = 0 OR c.assigned_to = $3)
       ORDER BY c.valid_until ASC NULLS LAST, c.created_at DESC`,
      [status, type, workerId]
    );

    return NextResponse.json({ contracts: rows });
  } catch (err) {
    console.error("GET Contracts error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  if (!b.client_full_name) {
    return NextResponse.json({ error: "Потрібне ПІБ клієнта" }, { status: 400 });
  }
  if (!b.title) {
    return NextResponse.json({ error: "Потрібна назва договору" }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO contracts (
        lead_id, client_full_name, client_contact, contract_type, title,
        value_pln, currency, status, signed_date, valid_from, valid_until,
        assigned_to, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        b.lead_id ? parseInt(b.lead_id) : null,
        b.client_full_name,
        b.client_contact || null,
        b.contract_type || "inne",
        b.title,
        b.value_pln ? parseFloat(b.value_pln) : 0.0,
        b.currency || "PLN",
        b.status || "draft",
        b.signed_date || null,
        b.valid_from || null,
        b.valid_until || null,
        b.assigned_to ? parseInt(b.assigned_to) : null,
        b.notes || null,
      ]
    );

    await q(
      `INSERT INTO contract_logs (contract_id, event, actor) VALUES ($1, 'Договір створено', $2)`,
      [row.id, auth.user?.full_name || "manager"]
    );

    return NextResponse.json({ contract: row }, { status: 201 });
  } catch (err) {
    console.error("POST Contract error:", err);
    return NextResponse.json({ error: "Помилка при створенні договору" }, { status: 500 });
  }
}
