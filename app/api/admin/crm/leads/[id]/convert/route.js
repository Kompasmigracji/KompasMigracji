export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    // 1. Get the lead
    const lead = await one(`SELECT * FROM kompas_leads WHERE id = $1`, [id]);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (lead.status === 'converted') {
      return NextResponse.json({ error: "Lead is already converted" }, { status: 400 });
    }

    // 2. Update lead status to 'converted' (valid values: 'new','in_progress','converted','closed')
    const updatedLead = await one(`
      UPDATE kompas_leads
      SET status = 'converted'
      WHERE id = $1
      RETURNING *
    `, [id]);

    return NextResponse.json({ data: updatedLead, message: "Lead successfully converted" });
  } catch (err) {
    console.error(`POST /api/admin/crm/leads/${params.id}/convert error:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
