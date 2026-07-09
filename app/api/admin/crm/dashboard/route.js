export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // We want to fetch the count of leads grouped by status
    const leads = await q(`SELECT status, COUNT(*) as count FROM kompas_leads GROUP BY status`);
    
    let stats = {
      new: 0,
      contacted: 0,
      pending: 0,
      won: 0,
      lost: 0
    };

    leads.forEach(row => {
      if (stats[row.status] !== undefined) {
        stats[row.status] = parseInt(row.count, 10);
      }
    });

    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    const data = [
      { id: 1, key: 'new', name: "Новий", color: "bg-red-500/20 text-red-400 border-red-500/30", qty: stats.new, conv: total > 0 ? Math.round((stats.new / total) * 100) + "%" : "0%", sum: "0 zł" },
      { id: 2, key: 'contacted', name: "В роботі", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", qty: stats.contacted, conv: total > 0 ? Math.round((stats.contacted / total) * 100) + "%" : "0%", sum: "0 zł" },
      { id: 3, key: 'pending', name: "Думає", color: "bg-sky-500/20 text-sky-400 border-sky-500/30", qty: stats.pending, conv: total > 0 ? Math.round((stats.pending / total) * 100) + "%" : "0%", sum: "0 zł" },
      { id: 4, key: 'won', name: "Успішно", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", qty: stats.won, conv: total > 0 ? Math.round((stats.won / total) * 100) + "%" : "0%", sum: "0 zł" },
      { id: 5, key: 'lost', name: "Відмова", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", qty: stats.lost, conv: total > 0 ? Math.round((stats.lost / total) * 100) + "%" : "0%", sum: "0 zł" },
    ];

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /api/admin/crm/dashboard error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
