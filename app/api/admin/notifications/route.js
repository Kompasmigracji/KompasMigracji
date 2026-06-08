import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

// Ensure table exists
function initTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function GET(req) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    initTable();

    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all(session.user_id);

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("Notifications GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    initTable();

    if (body.all) {
      db.prepare(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`).run(session.user_id);
    } else if (body.id) {
      db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`).run(body.id, session.user_id);
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notifications PUT error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
