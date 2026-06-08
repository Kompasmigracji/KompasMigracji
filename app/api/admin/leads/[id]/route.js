export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "member"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const rows = await q(
    `SELECT
       id,
       CASE
         WHEN chat_id IS NOT NULL THEN 'bot'
         WHEN source = 'main'     THEN 'site'
         WHEN source IS NOT NULL AND source != '' THEN source
         ELSE 'site'
       END AS source,
       COALESCE(first_name, '') AS name,
       COALESCE(contact, '')    AS contact,
       COALESCE(situation, '')  AS message,
       COALESCE(status, 'new')  AS status,
       country,
       service,
       urgency,
       username,
       chat_id,
       created_at,
       deleted_at
     FROM leads
     WHERE id = $1`,
    [id]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: rows[0] });
}
