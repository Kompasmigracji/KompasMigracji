export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const rows = await q(
      `
      SELECT
        c.id,
        c.channel,
        c.current_stage,
        c.status,
        c.created_at,
        c.updated_at,
        s.direction AS service_direction,
        s.subservice AS service_subservice,
        cl.full_name_latin,
        cl.phone_pl,
        cl.email,
        (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
      FROM conversations c
      LEFT JOIN services s ON s.id = c.service_id
      LEFT JOIN clients cl ON cl.id = c.client_id
      ${status ? "WHERE c.status = $1" : ""}
      ORDER BY c.updated_at DESC
      LIMIT 200
      `,
      status ? [status] : []
    );

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("GET /api/admin/crm/bot-conversations error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
