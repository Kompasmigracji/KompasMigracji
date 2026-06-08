export const dynamic = "force-dynamic";
// F7 admin: Manage appointments — list, confirm, cancel, complete
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "pending";
  const upcoming = url.searchParams.get("upcoming") === "1";

  const whereClause = upcoming
    ? "a.appointment_at > now() AND a.status NOT IN ('cancelled')"
    : `a.status = '${status.replace(/[^a-z_]/g, "")}'`;

  const rows = await q(
    `SELECT a.id, a.client_name, a.client_email, a.client_phone, a.service,
            a.appointment_at, a.duration_min, a.status, a.meeting_link,
            a.notes, a.reminder_sent, a.created_at,
            u.full_name AS assigned_name
     FROM kompas_appointments a
     LEFT JOIN kompas_users u ON u.id = a.assigned_to
     WHERE ${whereClause}
     ORDER BY a.appointment_at ASC LIMIT 100`,
  );

  return NextResponse.json({ appointments: rows });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const fields: string[] = [];
  const vals: unknown[] = [];
  let i = 1;

  if (body.status) { fields.push(`status=$${i++}`); vals.push(body.status); }
  if (body.meeting_link !== undefined) { fields.push(`meeting_link=$${i++}`); vals.push(body.meeting_link); }
  if (body.assigned_to !== undefined) { fields.push(`assigned_to=$${i++}`); vals.push(body.assigned_to); }
  if (body.notes !== undefined) { fields.push(`notes=$${i++}`); vals.push(body.notes); }

  if (!fields.length) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  vals.push(id);
  await one(`UPDATE kompas_appointments SET ${fields.join(",")} WHERE id=$${i}`, vals);
  return NextResponse.json({ ok: true });
}
