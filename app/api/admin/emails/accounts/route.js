export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/emails/accounts - List active email accounts for user
export async function GET() {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    let rows;
    if (auth.user.role === "admin") {
      rows = await q(
        `SELECT id, name, email_address, imap_host, imap_port, imap_ssl, 
                smtp_host, smtp_port, smtp_ssl, username, is_active, last_sync, created_at, user_id
         FROM kompas_email_accounts 
         ORDER BY created_at DESC`
      );
    } else {
      rows = await q(
        `SELECT id, name, email_address, imap_host, imap_port, imap_ssl, 
                smtp_host, smtp_port, smtp_ssl, username, is_active, last_sync, created_at, user_id
         FROM kompas_email_accounts 
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [auth.user.id]
      );
    }

    return NextResponse.json({ accounts: rows });
  } catch (err) {
    console.error("GET Email accounts error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

// POST /api/admin/emails/accounts - Create a new email account
export async function POST(req) {
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

  if (!b.name || !b.email_address || !b.username || !b.password) {
    return NextResponse.json(
      { error: "Назва, адреса, логін та пароль обов'язкові" },
      { status: 400 }
    );
  }

  try {
    const row = await one(
      `INSERT INTO kompas_email_accounts (
        user_id, name, email_address, imap_host, imap_port, imap_ssl,
        smtp_host, smtp_port, smtp_ssl, username, password_encrypted, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, name, email_address, imap_host, imap_port, imap_ssl, 
                smtp_host, smtp_port, smtp_ssl, username, is_active, created_at`,
      [
        auth.user.id,
        b.name,
        b.email_address,
        b.imap_host || null,
        b.imap_port ? parseInt(b.imap_port) : null,
        b.imap_ssl !== false,
        b.smtp_host || null,
        b.smtp_port ? parseInt(b.smtp_port) : null,
        b.smtp_ssl !== false,
        b.username,
        b.password, // Obfuscated or simple encrypted (saved plain for quick local dev IMAP test connection)
        b.is_active !== false,
      ]
    );

    return NextResponse.json({ account: row }, { status: 201 });
  } catch (err) {
    console.error("POST Email account error:", err);
    return NextResponse.json({ error: "Помилка при створенні акаунту" }, { status: 500 });
  }
}
