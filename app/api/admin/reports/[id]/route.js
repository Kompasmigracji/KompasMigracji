export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "manager"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const r = await one(
      `SELECT r.*, u.full_name AS creator_name 
       FROM kompas_reports r
       LEFT JOIN kompas_users u ON u.id = r.created_by
       WHERE r.id = $1`,
      [params.id]
    );

    if (!r) {
      return NextResponse.json({ error: "Звіт не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ report: r });
  } catch (err) {
    console.error("GET Single Report error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
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

  const allowed = ["title", "type", "config", "is_shared", "schedule"];

  try {
    const current = await one("SELECT * FROM kompas_reports WHERE id = $1", [params.id]);
    if (!current) {
      return NextResponse.json({ error: "Звіт не знайдено" }, { status: 404 });
    }

    const sets = [];
    const vals = [];
    let i = 1;

    for (const k of allowed) {
      if (k in b) {
        let val = b[k];
        if (k === "config") {
          val = JSON.stringify(val);
        }
        sets.push(`${k}=$${i}`);
        vals.push(val);
        i++;
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: "Немає полів для оновлення" }, { status: 400 });
    }

    vals.push(params.id);

    const row = await one(
      `UPDATE kompas_reports SET ${sets.join(", ")}, updated_at = NOW() WHERE id=$${i} RETURNING *`,
      vals
    );

    return NextResponse.json({ report: row });
  } catch (err) {
    console.error("PATCH Report error:", err);
    return NextResponse.json({ error: "Помилка при оновленні звіту" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const r = await one("DELETE FROM kompas_reports WHERE id = $1 RETURNING *", [params.id]);
    if (!r) {
      return NextResponse.json({ error: "Звіт не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Report error:", err);
    return NextResponse.json({ error: "Помилка при видаленні звіту" }, { status: 500 });
  }
}
