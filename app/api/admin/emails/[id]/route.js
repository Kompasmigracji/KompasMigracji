export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/emails/[id] - Get single email details
export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const row = await one(
      `SELECT e.*, u.full_name AS sender_name
       FROM kompas_emails e
       LEFT JOIN kompas_users u ON u.id = e.sent_by
       WHERE e.id = $1`,
      [params.id]
    );

    if (!row) {
      return NextResponse.json({ error: "Лист не знайдено" }, { status: 404 });
    }

    // Mark as read if received and currently unread
    if (row.status === "received" && !row.is_read) {
      await q("UPDATE kompas_emails SET is_read = true WHERE id = $1", [params.id]);
      row.is_read = true;
    }

    return NextResponse.json({ email: row });
  } catch (err) {
    console.error("GET Single email error:", err);
    return NextResponse.json({ error: "Помилка завантаження листа" }, { status: 500 });
  }
}

// PATCH /api/admin/emails/[id] - Update email read status or move folder
export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  try {
    const current = await one("SELECT * FROM kompas_emails WHERE id = $1", [params.id]);
    if (!current) {
      return NextResponse.json({ error: "Лист не знайдено" }, { status: 404 });
    }

    const allowed = ["folder", "is_read"];
    const sets = [];
    const vals = [];
    let i = 1;

    allowed.forEach((f) => {
      if (f in b) {
        sets.push(`${f} = $${i}`);
        vals.push(b[f]);
        i++;
      }
    });

    if (sets.length === 0) {
      return NextResponse.json({ error: "Немає полів для оновлення" }, { status: 400 });
    }

    vals.push(params.id);

    const row = await one(
      `UPDATE kompas_emails SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`,
      vals
    );

    return NextResponse.json({ email: row });
  } catch (err) {
    console.error("PATCH Single email error:", err);
    return NextResponse.json({ error: "Помилка оновлення листа" }, { status: 500 });
  }
}

// DELETE /api/admin/emails/[id] - Permanently delete an email
export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const row = await one("DELETE FROM kompas_emails WHERE id = $1 RETURNING *", [params.id]);
    if (!row) {
      return NextResponse.json({ error: "Лист не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Single email error:", err);
    return NextResponse.json({ error: "Помилка при видаленні листа" }, { status: 500 });
  }
}
