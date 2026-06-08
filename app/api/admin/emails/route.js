export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const folder = url.searchParams.get("folder") || "inbox";

  try {
    const rows = await q(
      `SELECT
         id,
         subject,
         from_address,
         to_addresses,
         body_text,
         folder,
         status,
         is_read,
         created_at
       FROM kompas_emails
       WHERE folder = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [folder]
    );

    return NextResponse.json({ emails: rows });
  } catch (error) {
    console.error("Email GET error:", error);
    // If table doesn't exist yet, return empty
    return NextResponse.json({ emails: [] });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const b = await req.json();
    
    if (!b.to || !b.subject || !b.body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert as "sent"
    const rows = await q(
      `INSERT INTO kompas_emails (
         from_address, to_addresses, subject, body_text, folder, status, sent_by
       ) VALUES (
         $1, $2, $3, $4, 'sent', 'sent', $5
       ) RETURNING id`,
      ["system@kompascrm.com", [b.to], b.subject, b.body, auth.user.id]
    );

    return NextResponse.json({ ok: true, emailId: rows[0].id });
  } catch (error) {
    console.error("Email POST error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const b = await req.json();
    if (!b.id || b.is_read === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await q("UPDATE kompas_emails SET is_read = $1 WHERE id = $2", [b.is_read, b.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}
