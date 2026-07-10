export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const row = await one(`
      UPDATE kompas_leads
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (!row) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Mirror to 'leads' table if needed
    if (row.email || row.contact) {
      await q(`
        UPDATE leads
        SET status = $1
        WHERE email = $2 OR contact = $3
      `, [status, row.email, row.contact]);
    }

    return NextResponse.json({ data: row });
  } catch (err) {
    console.error(`PATCH /api/admin/crm/leads/${params.id} error:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    const row = await one(`
      UPDATE kompas_leads
      SET deleted_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (!row) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ data: row });
  } catch (err) {
    console.error(`DELETE /api/admin/crm/leads/${params.id} error:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
