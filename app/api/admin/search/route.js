export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q } from "@/lib/db";

export async function GET(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const likeQuery = `%${query}%`;
    const results = [];

    // Search Users (Agents / Staff)
    try {
      const users = await q(`
        SELECT id, full_name as name, role, email 
        FROM kompas_users 
        WHERE full_name ILIKE $1 OR email ILIKE $1 
        LIMIT 5
      `, [likeQuery]);
      
      if (users && users.length > 0) {
        results.push({
          type: "Users",
          items: users.map(u => ({
            title: u.name,
            subtitle: `${u.role} • ${u.email}`,
            icon: "user",
            url: `/admin/members`
          }))
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Search Leads
    try {
      const leads = await q(`
        SELECT id, COALESCE(first_name, 'Unnamed') as name, contact as phone, status 
        FROM leads 
        WHERE first_name ILIKE $1 OR contact ILIKE $1 OR username ILIKE $1
        LIMIT 5
      `, [likeQuery]);

      if (leads && leads.length > 0) {
        results.push({
          type: "Leads",
          items: leads.map(l => ({
            title: l.name,
            subtitle: `${l.phone || "No phone"} • ${l.status || "new"}`,
            icon: "target",
            url: `/admin/leads/${l.id}`
          }))
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Search Cases
    try {
      const cases = await q(`
        SELECT id, title, status
        FROM kompas_cases
        WHERE title ILIKE $1 OR description ILIKE $1
        LIMIT 5
      `, [likeQuery]);

      if (cases && cases.length > 0) {
        results.push({
          type: "Cases",
          items: cases.map(c => ({
            title: c.title,
            subtitle: `Case • ${c.status}`,
            icon: "briefcase",
            url: `/admin/cases`
          }))
        });
      }
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Global search error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
