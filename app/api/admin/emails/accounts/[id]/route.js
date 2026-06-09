export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// PATCH /api/admin/emails/accounts/[id] - Update account
export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
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
    const current = await one("SELECT * FROM kompas_email_accounts WHERE id = $1", [params.id]);
    if (!current) {
      return NextResponse.json({ error: "Акаунт не знайдено" }, { status: 404 });
    }

    // Security check: only owner or admin can edit
    if (auth.user.role !== "admin" && current.user_id !== auth.user.id) {
      return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    const fields = [
      "name", "email_address", "imap_host", "imap_port", "imap_ssl",
      "smtp_host", "smtp_port", "smtp_ssl", "username", "password_encrypted", "is_active"
    ];

    const sets = [];
    const vals = [];
    let i = 1;

    fields.forEach((f) => {
      let valKey = f;
      if (f === "password_encrypted" && "password" in b) {
        sets.push(`${f} = $${i}`);
        vals.push(b.password);
        i++;
      } else if (f in b) {
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
      `UPDATE kompas_email_accounts 
       SET ${sets.join(", ")} 
       WHERE id = $${i} 
       RETURNING id, name, email_address, imap_host, imap_port, imap_ssl, 
                 smtp_host, smtp_port, smtp_ssl, username, is_active`,
      vals
    );

    return NextResponse.json({ account: row });
  } catch (err) {
    console.error("PATCH Email account error:", err);
    return NextResponse.json({ error: "Помилка при оновленні акаунту" }, { status: 500 });
  }
}

// DELETE /api/admin/emails/accounts/[id] - Remove account configuration
export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const current = await one("SELECT * FROM kompas_email_accounts WHERE id = $1", [params.id]);
    if (!current) {
      return NextResponse.json({ error: "Акаунт не знайдено" }, { status: 404 });
    }

    // Security check: only owner or admin can edit
    if (auth.user.role !== "admin" && current.user_id !== auth.user.id) {
      return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    await q("DELETE FROM kompas_email_accounts WHERE id = $1", [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Email account error:", err);
    return NextResponse.json({ error: "Помилка при видаленні акаунту" }, { status: 500 });
  }
}
