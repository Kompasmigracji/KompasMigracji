export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Column Whitelists for Security
const WHITELISTS = {
  leads: {
    table: "kompas_leads",
    columns: ["id", "source", "name", "contact", "message", "status", "assigned_to", "created_at"]
  },
  members: {
    table: "kompas_users u LEFT JOIN kompas_member_profiles p ON p.user_id = u.id",
    baseFilter: "u.role = 'member'",
    columns: [
      "id", "email", "full_name", "role", "status", "phone", "created_at",
      "member_no", "category", "city", "country", "join_date", "dues_status", "notes"
    ],
    // Map conflicting columns to clear prefixes
    columnMappings: {
      id: "u.id",
      status: "u.status",
      created_at: "u.created_at",
      notes: "p.notes"
    }
  },
  deals: {
    table: "kompas_deals",
    columns: ["id", "title", "lead_id", "member_id", "assigned_to", "stage", "amount", "currency", "probability", "expected_close", "closed_at", "notes", "created_at", "updated_at"]
  },
  cases: {
    table: "cases",
    columns: ["id", "lead_id", "full_name", "contact", "case_number", "submission_date", "urzad", "stage", "status", "has_dodatek_1", "has_zus_cert", "deadline_date", "notes", "created_at"]
  }
};

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const execute = searchParams.get("execute") === "true";
  const reportId = searchParams.get("id");

  // LIST SAVED REPORTS
  if (!execute) {
    try {
      const rows = await q(
        `SELECT r.*, u.full_name AS creator_name 
         FROM kompas_reports r
         LEFT JOIN kompas_users u ON u.id = r.created_by
         ORDER BY r.created_at DESC`
      );
      return NextResponse.json({ reports: rows });
    } catch (err) {
      console.error("GET Reports list error:", err);
      return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
    }
  }

  // EXECUTE REPORT DYNAMICALLY
  if (!reportId) {
    return NextResponse.json({ error: "Потрібно вказати id звіту для виконання" }, { status: 400 });
  }

  try {
    const report = await one("SELECT * FROM kompas_reports WHERE id = $1", [reportId]);
    if (!report) {
      return NextResponse.json({ error: "Звіт не знайдено" }, { status: 404 });
    }

    const { entity_type, type, config } = report;
    const whitelist = WHITELISTS[entity_type];
    
    if (!whitelist) {
      return NextResponse.json({ error: "Непідтримуваний тип сутності" }, { status: 400 });
    }

    // Build Dynamic Query Parts
    const selectedFields = config.fields || [];
    const groupings = config.groupings || [];
    const aggregations = config.aggregations || []; // e.g. [{ func: 'SUM', field: 'amount' }]
    const filters = config.filters || []; // e.g. [{ field: 'status', op: '=', val: 'new' }]

    // Whitelist check fields
    const validFields = selectedFields.filter(f => whitelist.columns.includes(f));
    const validGroupings = groupings.filter(g => whitelist.columns.includes(g));

    let selectClause = "";
    if (type === "list") {
      if (validFields.length === 0) {
        selectClause = "*";
      } else {
        selectClause = validFields.map(f => {
          const mapping = whitelist.columnMappings?.[f] || f;
          return `${mapping} AS ${f}`;
        }).join(", ");
      }
    } else {
      // Summary / Chart reports require aggregation & grouping
      const selectParts = [];
      validGroupings.forEach(g => {
        const mapping = whitelist.columnMappings?.[g] || g;
        selectParts.push(`${mapping} AS ${g}`);
      });

      aggregations.forEach((agg, idx) => {
        const func = agg.func.toUpperCase();
        if (["COUNT", "SUM", "AVG", "MIN", "MAX"].includes(func)) {
          const f = agg.field;
          const mapping = f === "*" ? "*" : (whitelist.columnMappings?.[f] || f || "*");
          if (f === "*" || whitelist.columns.includes(f)) {
            selectParts.push(`${func}(${mapping}) AS agg_${idx}_${func.toLowerCase()}_${f.replace("*", "all")}`);
          }
        }
      });

      if (selectParts.length === 0) {
        selectParts.push("COUNT(*) AS count");
      }
      selectClause = selectParts.join(", ");
    }

    // Build WHERE clause
    const whereParts = [];
    const whereVals = [];
    let paramIdx = 1;

    if (whitelist.baseFilter) {
      whereParts.push(whitelist.baseFilter);
    }

    filters.forEach(f => {
      const field = f.field;
      const op = f.op;
      const val = f.val;
      const mapping = whitelist.columnMappings?.[field] || field;

      if (whitelist.columns.includes(field) && ["=", "!=", ">", "<", ">=", "<=", "LIKE", "ILIKE"].includes(op)) {
        whereParts.push(`${mapping} ${op} $${paramIdx}`);
        whereVals.push(op.includes("LIKE") ? `%${val}%` : val);
        paramIdx++;
      }
    });

    const whereClause = whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";
    const groupClause = (type !== "list" && validGroupings.length > 0) 
      ? "GROUP BY " + validGroupings.map(g => whitelist.columnMappings?.[g] || g).join(", ") 
      : "";

    const query = `
      SELECT ${selectClause} 
      FROM ${whitelist.table} 
      ${whereClause} 
      ${groupClause} 
      LIMIT 1000
    `;

    console.log("Executing dynamic report SQL:", query, whereVals);
    const data = await q(query, whereVals);

    return NextResponse.json({ report, data });
  } catch (err) {
    console.error("Execute Report Error:", err);
    return NextResponse.json({ error: "Помилка при виконанні звіту: " + err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  if (!b.title || !b.entity_type) {
    return NextResponse.json({ error: "title та entity_type обов'язкові" }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO kompas_reports (title, type, entity_type, config, created_by, is_shared, schedule)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        b.title,
        b.type || "list",
        b.entity_type,
        b.config ? JSON.stringify(b.config) : '{}',
        auth.user.id,
        b.is_shared || false,
        b.schedule || null
      ]
    );

    return NextResponse.json({ report: row }, { status: 201 });
  } catch (err) {
    console.error("POST Report error:", err);
    return NextResponse.json({ error: "Помилка при створенні звіту" }, { status: 500 });
  }
}
