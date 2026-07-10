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

    if (lead.status === 'won') {
      return NextResponse.json({ error: "Lead is already won/converted" }, { status: 400 });
    }

    // 2. Insert into buyers table
    // 'buyers' uses uuid, so we let the database generate the ID if it has a default uuid_generate_v4()
    // or we insert it manually. Assuming the db handles UUID defaults.
    const newBuyer = await one(`
      INSERT INTO buyers (full_name, phone, email, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [lead.name || 'Anonymous', lead.contact || '', lead.email || '']);

    // 3. Update lead status to won
    await one(`
      UPDATE kompas_leads
      SET status = 'won'
      WHERE id = $1
    `, [id]);

    // Also update mirrored table
    if (lead.email || lead.contact) {
      await q(`
        UPDATE leads
        SET status = 'won'
        WHERE email = $1 OR contact = $2
      `, [lead.email, lead.contact]);
    }

    return NextResponse.json({ data: newBuyer, message: "Lead successfully converted to buyer" });
  } catch (err) {
    console.error(`POST /api/admin/crm/leads/${params.id}/convert error:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
