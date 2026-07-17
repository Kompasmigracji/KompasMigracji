export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { one, q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const conversation = await one(
      `
      SELECT
        c.*,
        s.direction AS service_direction,
        s.subservice AS service_subservice,
        cl.full_name_latin,
        cl.phone_pl,
        cl.email,
        cl.preferred_contact
      FROM conversations c
      LEFT JOIN services s ON s.id = c.service_id
      LEFT JOIN clients cl ON cl.id = c.client_id
      WHERE c.id = $1
      `,
      [params.id]
    );
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const messages = await q(
      `SELECT id, sender, content, knowledge_card_id, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [params.id]
    );

    return NextResponse.json({ data: { conversation, messages } });
  } catch (err) {
    console.error("GET /api/admin/crm/bot-conversations/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
