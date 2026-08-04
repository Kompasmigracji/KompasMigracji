export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const STATUS_LABEL = {
  draft: "Чернетка",
  active: "Активний",
  completed: "Завершено",
  terminated: "Розірвано",
  expired: "Термін дії закінчився",
};

const ALLOWED_FIELDS = [
  "lead_id", "client_full_name", "client_contact", "contract_type", "title",
  "value_pln", "currency", "status", "signed_date", "valid_from", "valid_until",
  "assigned_to", "notes",
];

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = parseInt(params.id);
  if (!id) {
    return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
  }

  try {
    const contract = await one(
      `SELECT
         c.id, c.lead_id, c.client_full_name, c.client_contact, c.contract_type,
         c.title, c.value_pln, c.currency, c.status, c.signed_date, c.valid_from,
         c.valid_until, c.assigned_to, c.notes, c.created_at, c.updated_at,
         u.full_name AS assigned_to_name
       FROM contracts c
       LEFT JOIN kompas_users u ON u.id = c.assigned_to
       WHERE c.id = $1`,
      [id]
    );

    if (!contract) {
      return NextResponse.json({ error: "Договір не знайдено" }, { status: 404 });
    }

    const logs = await q(
      `SELECT * FROM contract_logs WHERE contract_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    return NextResponse.json({ contract, logs });
  } catch (err) {
    console.error("GET Single Contract error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = parseInt(params.id);
  if (!id) {
    return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  try {
    const current = await one("SELECT * FROM contracts WHERE id = $1", [id]);
    if (!current) {
      return NextResponse.json({ error: "Договір не знайдено" }, { status: 404 });
    }

    const sets = [];
    const vals = [];
    let i = 1;

    for (const k of ALLOWED_FIELDS) {
      if (k in b) {
        let val = b[k];
        if (k === "lead_id" || k === "assigned_to") {
          val = val ? parseInt(val) : null;
        } else if (k === "value_pln") {
          val = val ? parseFloat(val) : 0.0;
        }
        sets.push(`${k}=$${i}`);
        vals.push(val);
        i++;
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: "Немає полів для оновлення" }, { status: 400 });
    }

    vals.push(id);

    const row = await one(
      `UPDATE contracts SET ${sets.join(", ")}, updated_at = NOW() WHERE id=$${i} RETURNING *`,
      vals
    );

    const actor = auth.user?.full_name || "System";

    if ("status" in b && b.status !== current.status) {
      const fromLabel = STATUS_LABEL[current.status] || current.status;
      const toLabel = STATUS_LABEL[b.status] || b.status;
      await q(
        `INSERT INTO contract_logs (contract_id, event, actor) VALUES ($1, $2, $3)`,
        [id, `Статус змінено: ${fromLabel} → ${toLabel}`, actor]
      );
    }

    const otherChanged = Object.keys(b).filter((k) => ALLOWED_FIELDS.includes(k) && k !== "status");
    if (otherChanged.length > 0) {
      await q(
        `INSERT INTO contract_logs (contract_id, event, actor) VALUES ($1, $2, $3)`,
        [id, `Оновлено поля: ${otherChanged.join(", ")}`, actor]
      );
    }

    return NextResponse.json({ contract: row });
  } catch (err) {
    console.error("PATCH Contract error:", err);
    return NextResponse.json({ error: "Помилка при оновленні договору" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = parseInt(params.id);
  if (!id) {
    return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
  }

  try {
    const row = await one("DELETE FROM contracts WHERE id = $1 RETURNING *", [id]);
    if (!row) {
      return NextResponse.json({ error: "Договір не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Contract error:", err);
    return NextResponse.json({ error: "Помилка при видаленні договору" }, { status: 500 });
  }
}
