export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const ALLOWED_FIELDS = [
  "deadline_type", "title", "target_date", "notes", "locale", "status",
  "contact_email", "telegram_chat_id",
];

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = params;

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const sets = [];
  const vals = [];
  let i = 1;

  for (const k of ALLOWED_FIELDS) {
    if (k in b) {
      let val = b[k];
      if (k === "telegram_chat_id") val = val ? parseInt(val) : null;
      sets.push(`${k}=$${i}`);
      vals.push(val);
      i++;
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: "Немає полів для оновлення" }, { status: 400 });
  }

  vals.push(id);

  try {
    const row = await one(
      `UPDATE kompas_deadlines SET ${sets.join(", ")}, updated_at = NOW() WHERE id=$${i} RETURNING *`,
      vals
    );
    if (!row) {
      return NextResponse.json({ error: "Термін не знайдено" }, { status: 404 });
    }
    return NextResponse.json({ deadline: row });
  } catch (err) {
    console.error("PATCH deadline error:", err);
    return NextResponse.json({ error: "Помилка при оновленні терміну" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = params;

  try {
    const row = await one(`DELETE FROM kompas_deadlines WHERE id = $1 RETURNING *`, [id]);
    if (!row) {
      return NextResponse.json({ error: "Термін не знайдено" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE deadline error:", err);
    return NextResponse.json({ error: "Помилка при видаленні терміну" }, { status: 500 });
  }
}
