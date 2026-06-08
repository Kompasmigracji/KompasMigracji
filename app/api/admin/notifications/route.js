export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q } from "@/lib/db";

export async function GET(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const notifications = await q(`
      SELECT * FROM kompas_notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [auth.user.id]);

    return NextResponse.json({ notifications: notifications || [] });
  } catch (err) {
    console.error("Notifications GET error:", err);
    // Return empty if table not yet migrated
    return NextResponse.json({ notifications: [] });
  }
}

export async function PUT(req) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();

    if (body.all) {
      await q(`UPDATE kompas_notifications SET read = true WHERE user_id = $1`, [auth.user.id]);
    } else if (body.id) {
      await q(`UPDATE kompas_notifications SET read = true WHERE id = $1 AND user_id = $2`, [body.id, auth.user.id]);
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notifications PUT error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
