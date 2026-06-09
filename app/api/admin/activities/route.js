export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entity_type") || "";
  const entityId = searchParams.get("entity_id") || "";

  if (!entityType || !entityId) {
    return NextResponse.json({ error: "entity_type та entity_id обов'язкові" }, { status: 400 });
  }

  try {
    const rows = await q(
      `SELECT a.*, u.full_name AS actor_name
       FROM kompas_activities a
       LEFT JOIN kompas_users u ON u.id = a.actor_id
       WHERE a.entity_type = $1 AND a.entity_id = $2
       ORDER BY a.created_at DESC`,
      [entityType, entityId]
    );

    return NextResponse.json({ activities: rows });
  } catch (err) {
    console.error("GET Activities error:", err);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator", "manager", "sales", "lawyer"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  if (!b.entity_type || !b.entity_id || !b.type) {
    return NextResponse.json({ error: "entity_type, entity_id та type обов'язкові" }, { status: 400 });
  }

  try {
    const row = await one(
      `INSERT INTO kompas_activities (
        entity_type, entity_id, actor_id, type, title, body, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        b.entity_type,
        String(b.entity_id),
        auth.user.id,
        b.type,
        b.title || null,
        b.body || null,
        b.metadata ? JSON.stringify(b.metadata) : '{}'
      ]
    );

    // Also get the actor name for UI immediate appending
    const result = {
      ...row,
      actor_name: auth.user.name || "Користувач"
    };

    return NextResponse.json({ activity: result }, { status: 201 });
  } catch (err) {
    console.error("POST Activity error:", err);
    return NextResponse.json({ error: "Помилка при створенні активності" }, { status: 500 });
  }
}
