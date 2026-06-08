import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const likeQuery = `%${query}%`;
    const results = [];

    // Search Users (Agents / Staff)
    const users = db.prepare(`
      SELECT id, name, role, email 
      FROM users 
      WHERE name LIKE ? OR email LIKE ? 
      LIMIT 5
    `).all(likeQuery, likeQuery);
    
    if (users.length > 0) {
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

    // Search Leads
    const leads = db.prepare(`
      SELECT id, name, phone, status 
      FROM leads 
      WHERE name LIKE ? OR phone LIKE ? 
      LIMIT 5
    `).all(likeQuery, likeQuery);

    if (leads.length > 0) {
      results.push({
        type: "Leads",
        items: leads.map(l => ({
          title: l.name || "Unnamed Lead",
          subtitle: `${l.phone || "No phone"} • ${l.status}`,
          icon: "target",
          url: `/admin/leads?id=${l.id}`
        }))
      });
    }

    // Search Invoices
    try {
      const invoices = db.prepare(`
        SELECT id, amount, currency, status, created_at
        FROM invoices
        WHERE id LIKE ? OR status LIKE ?
        LIMIT 5
      `).all(likeQuery, likeQuery);

      if (invoices.length > 0) {
        results.push({
          type: "Invoices",
          items: invoices.map(inv => ({
            title: `Invoice #${inv.id}`,
            subtitle: `${inv.amount} ${inv.currency} • ${inv.status}`,
            icon: "cash",
            url: `/admin/finance`
          }))
        });
      }
    } catch (e) {
      // Invoices table might not exist yet if migrations aren't fully run, ignore gracefully
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Global search error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
