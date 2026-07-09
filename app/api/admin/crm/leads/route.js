export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { getUser } from "@/lib/auth"; // Assume we have a get session method

export async function GET(req) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const leads = await q(`
      SELECT 
        id, 
        name, 
        contact, 
        email, 
        source, 
        message, 
        situation, 
        status, 
        created_at 
      FROM kompas_leads 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({ data: leads });
  } catch (err) {
    console.error("GET /api/admin/crm/leads error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, contact, email, source = 'manual', message, situation, status = 'new' } = body;

    if (!name || !contact) {
      return NextResponse.json({ error: "Name and contact are required" }, { status: 400 });
    }

    const row = await one(`
      INSERT INTO kompas_leads (name, contact, email, source, message, situation, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [name, contact, email || null, source, message || null, situation || null, status]);

    // Also mirror to 'leads' table for consistency with old code
    await one(`
      INSERT INTO leads (first_name, contact, email, source, message, situation, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())
      ON CONFLICT DO NOTHING
    `, [name, contact, email || null, source, message || null, situation || null]);

    return NextResponse.json({ data: row });
  } catch (err) {
    console.error("POST /api/admin/crm/leads error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
