export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      lines.push(row.map(cell => cell.trim()));
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row.map(cell => cell.trim()));
  }
  return lines;
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const entityType = formData.get("entity_type");
    const fieldMapStr = formData.get("field_map") || "{}";
    
    if (!file || !entityType) {
      return NextResponse.json({ error: "Потрібно завантажити файл та вказати entity_type" }, { status: 400 });
    }

    const fieldMap = JSON.parse(fieldMapStr);
    const text = await file.text();
    const lines = parseCSV(text);

    if (lines.length < 2) {
      return NextResponse.json({ error: "Файл порожній або містить недостатньо рядків" }, { status: 400 });
    }

    const headers = lines[0];
    const dataRows = lines.slice(1);
    
    // Setup mappings from CSV header index to database columns
    const mappings = {};
    headers.forEach((h, idx) => {
      const dbCol = fieldMap[h] || h.toLowerCase().trim().replace(/[\s_]+/g, "_");
      mappings[idx] = dbCol;
    });

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Default password hash for imported users
    const defaultPasswordHash = await bcrypt.hash("Kompas123", 10);

    for (let rIdx = 0; rIdx < dataRows.length; rIdx++) {
      const row = dataRows[rIdx];
      if (row.length < headers.length) continue; // Skip partial rows

      // Map row to key-value record based on mappings
      const record = {};
      row.forEach((cell, cellIdx) => {
        const dbCol = mappings[cellIdx];
        if (dbCol) {
          record[dbCol] = cell;
        }
      });

      try {
        if (entityType === "leads") {
          await q(
            `INSERT INTO kompas_leads (source, name, contact, message, status, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              record.source || "site",
              record.name || record.full_name || "Без імені",
              record.contact || record.phone || record.email || "",
              record.message || record.notes || "",
              record.status || "new",
              record.assigned_to ? parseInt(record.assigned_to) : null
            ]
          );
        } else if (entityType === "members") {
          // 1. Insert into kompas_users
          const email = record.email || `imported_user_${Date.now()}_${rIdx}@kompasmigracji.com`;
          const fullName = record.full_name || record.name || "Ім'я не вказано";
          const phone = record.phone || record.contact || null;
          const status = record.status || "active";

          const userRow = await one(
            `INSERT INTO kompas_users (email, password_hash, full_name, role, status, phone)
             VALUES ($1, $2, $3, 'member', $4, $5)
             RETURNING id`,
            [email, defaultPasswordHash, fullName, status, phone]
          );

          // 2. Insert into profiles
          await q(
            `INSERT INTO kompas_member_profiles (user_id, member_no, category, city, country, join_date, dues_status, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              userRow.id,
              record.member_no || `KM-${Math.floor(100000 + Math.random() * 900000)}`,
              record.category || "standard",
              record.city || null,
              record.country || "Polska",
              record.join_date ? new Date(record.join_date) : new Date(),
              record.dues_status || "unpaid",
              record.notes || null
            ]
          );
        } else if (entityType === "deals") {
          await q(
            `INSERT INTO kompas_deals (title, lead_id, member_id, assigned_to, stage, amount, currency, probability, expected_close, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              record.title || "Угода з імпорту",
              record.lead_id ? parseInt(record.lead_id) : null,
              record.member_id ? parseInt(record.member_id) : null,
              record.assigned_to ? parseInt(record.assigned_to) : null,
              record.stage || "prospecting",
              record.amount ? parseFloat(record.amount) : 0.00,
              record.currency || "PLN",
              record.probability ? parseInt(record.probability) : 0,
              record.expected_close ? new Date(record.expected_close) : null,
              record.notes || null
            ]
          );
        } else if (entityType === "cases") {
          await q(
            `INSERT INTO cases (lead_id, full_name, contact, case_number, submission_date, urzad, stage, status, has_dodatek_1, has_zus_cert, deadline_date, notes, assigned_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              record.lead_id ? parseInt(record.lead_id) : null,
              record.full_name || record.name || "Без імені",
              record.contact || record.phone || "",
              record.case_number || null,
              record.submission_date ? new Date(record.submission_date) : null,
              record.urzad || record.office || null,
              record.stage || "analysis",
              record.status || "active",
              record.has_dodatek_1 === "true" || record.has_dodatek_1 === "t" || record.has_dodatek_1 === "1",
              record.has_zus_cert === "true" || record.has_zus_cert === "t" || record.has_zus_cert === "1",
              record.deadline_date ? new Date(record.deadline_date) : null,
              record.notes || null,
              record.assigned_to ? parseInt(record.assigned_to) : null
            ]
          );
        }

        successCount++;
      } catch (err) {
        failCount++;
        errors.push(`Рядок ${rIdx + 2}: ${err.message}`);
      }
    }

    // Insert audit log
    await q(
      `INSERT INTO kompas_audit_log (user_id, action, entity, meta)
       VALUES ($1, 'import', $2, $3)`,
      [
        auth.user.id,
        entityType,
        JSON.stringify({ success_count: successCount, fail_count: failCount })
      ]
    );

    return NextResponse.json({
      success: true,
      successCount,
      failCount,
      errors
    });
  } catch (err) {
    console.error("Import parse error:", err);
    return NextResponse.json({ error: "Помилка при імпорті файлу" }, { status: 500 });
  }
}
