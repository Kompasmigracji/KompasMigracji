import { NextResponse } from "next/server";
import { q as query } from "@/lib/db";

export async function POST(req) {
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
