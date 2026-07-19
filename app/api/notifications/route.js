import { NextResponse } from "next/server";
import { q as query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const body = await req.json();
    const { title, message, type = "system" } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO notifications (title, message, type, is_read) 
       VALUES ($1, $2, $3, false) RETURNING *`,
      [title, message, type],
    );

    return NextResponse.json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error("Error creating notification:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  const auth = await requireAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const result = await query(
      `SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`,
    );

    return NextResponse.json({ notifications: result.rows });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  const auth = await requireAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    // Mark as read
    await query(
      `UPDATE notifications SET is_read = true WHERE is_read = false`,
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
