export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const rows = await q(`
      SELECT
        id,
        COALESCE(name, first_name) AS name,
        COALESCE(contact, phone) AS contact,
        email,
        service,
        COALESCE(situation, message) AS message,
        status,
        source,
        created_at
      FROM leads
      WHERE source IN ('orakul', 'orakul_web') AND deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("GET /api/admin/crm/ewu-candidates error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const row = await one(
      `UPDATE leads SET status = $1 WHERE id = $2 AND source IN ('orakul', 'orakul_web') RETURNING id`,
      [status, id]
    );
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/crm/ewu-candidates error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
