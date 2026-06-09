export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const d = await one(
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
      WHERE d.id = $1`,
      [params.id]
    );

    if (!d) {
      return NextResponse.json({ error: "Угоду не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ deal: d });
  } catch (err) {
    console.error("GET Single Deal error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
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

  const allowed = [
    "title", "lead_id", "member_id", "assigned_to", "stage",
    "amount", "currency", "probability", "expected_close", "notes"
  ];

  try {
    // Check if deal exists
    const current = await one("SELECT * FROM kompas_deals WHERE id = $1", [params.id]);
    if (!current) {
      return NextResponse.json({ error: "Угоду не знайдено" }, { status: 404 });
    }

    const sets = [];
    const vals = [];
    let i = 1;

    for (const k of allowed) {
      if (k in b) {
        let val = b[k];
        if (k === "lead_id" || k === "member_id" || k === "assigned_to") {
          val = val ? parseInt(val) : null;
        } else if (k === "amount") {
          val = val ? parseFloat(val) : 0.00;
        } else if (k === "probability") {
          val = val ? parseInt(val) : 0;
        }
        sets.push(`${k}=$${i}`);
        vals.push(val);
        i++;
      }
    }

    // Handle closed_at logic automatically if stage changes to closed_won / closed_lost
    if (b.stage && b.stage !== current.stage) {
      sets.push(`closed_at=$${i}`);
      if (b.stage === "closed_won" || b.stage === "closed_lost") {
        vals.push(new Date().toISOString());
      } else {
        vals.push(null);
      }
      i++;
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: "Немає полів для оновлення" }, { status: 400 });
    }

    vals.push(params.id);

    const row = await one(
      `UPDATE kompas_deals SET ${sets.join(", ")}, updated_at = NOW() WHERE id=$${i} RETURNING *`,
      vals
    );

    // Audit log
    await q(
      `INSERT INTO kompas_audit_log (user_id, action, entity, entity_id, meta)
       VALUES ($1, 'update', 'deal', $2, $3)`,
      [
        auth.user.id,
        row.id,
        JSON.stringify({
          changed_fields: Object.keys(b),
          stage: row.stage,
          amount: row.amount
        })
      ]
    );

    return NextResponse.json({ deal: row });
  } catch (err) {
    console.error("PATCH Deal error:", err);
    return NextResponse.json({ error: "Помилка при оновленні угоди" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const d = await one("DELETE FROM kompas_deals WHERE id = $1 RETURNING *", [params.id]);
    if (!d) {
      return NextResponse.json({ error: "Угоду не знайдено" }, { status: 404 });
    }

    // Audit log
    await q(
      `INSERT INTO kompas_audit_log (user_id, action, entity, entity_id, meta)
       VALUES ($1, 'delete', 'deal', $2, $3)`,
      [
        auth.user.id,
        params.id,
        JSON.stringify({ title: d.title })
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Deal error:", err);
    return NextResponse.json({ error: "Помилка при видаленні угоди" }, { status: 500 });
  }
}
