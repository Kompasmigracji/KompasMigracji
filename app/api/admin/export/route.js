export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entity_type") || "";

  if (!entityType) {
    return NextResponse.json({ error: "entity_type обов'язковий" }, { status: 400 });
  }

  try {
    let rows = [];
    let headers = [];
    
    if (entityType === "leads") {
      headers = ["ID", "Source", "Name", "Contact", "Message", "Status", "Assigned To ID", "Created At"];
      rows = await q(`SELECT id, source, name, contact, message, status, assigned_to, created_at FROM kompas_leads ORDER BY id ASC`);
    } else if (entityType === "members") {
      headers = ["ID", "Email", "Full Name", "Phone", "Role", "Status", "Member No", "Category", "City", "Country", "Join Date", "Dues Status", "Notes"];
      rows = await q(
        `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.status,
                p.member_no, p.category, p.city, p.country, p.join_date, p.dues_status, p.notes
         FROM kompas_users u
         LEFT JOIN kompas_member_profiles p ON p.user_id = u.id
         WHERE u.role = 'member'
         ORDER BY u.id ASC`
      );
    } else if (entityType === "deals") {
      headers = ["ID", "Title", "Lead ID", "Member ID", "Assigned To ID", "Stage", "Amount", "Currency", "Probability %", "Expected Close", "Notes", "Created At"];
      rows = await q(
        `SELECT id, title, lead_id, member_id, assigned_to, stage, amount, currency, probability, expected_close, notes, created_at 
         FROM kompas_deals 
         ORDER BY created_at DESC`
      );
    } else if (entityType === "cases") {
      headers = ["ID", "Lead ID", "Full Name", "Contact", "Case Number", "Submission Date", "Urzad", "Stage", "Status", "Has Dodatek 1", "Has ZUS Cert", "Deadline Date", "Notes", "Created At"];
      rows = await q(
        `SELECT id, lead_id, full_name, contact, case_number, submission_date, urzad, stage, status, has_dodatek_1, has_zus_cert, deadline_date, notes, created_at 
         FROM cases 
         ORDER BY id ASC`
      );
    } else {
      return NextResponse.json({ error: "Непідтримуваний тип сутності" }, { status: 400 });
    }

    // Helper to escape CSV field values
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return "";
      let str = typeof val === "object" ? JSON.stringify(val) : String(val);
      str = str.replace(/"/g, '""');
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str}"`;
      }
      return str;
    };

    // Construct CSV String
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      const line = Object.values(row).map(escapeCSV).join(",");
      csvContent += line + "\n";
    });

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${entityType}_export_${new Date().toISOString().substring(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Помилка при експорті даних" }, { status: 500 });
  }
}
