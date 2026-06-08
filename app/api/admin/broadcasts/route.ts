export const dynamic = "force-dynamic";
/* Innovation 3: Broadcasts API
   F7: GET with segment preview (count of recipients per segment)
   F8/F9: POST creates draft; PUT /[id]/send triggers actual send */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// F7: Auto segment size calculation
async function segmentCount(segment: string): Promise<number> {
  if (segment === "all") {
    const r = await one("SELECT count(*) AS n FROM leads WHERE deleted_at IS NULL AND chat_id IS NOT NULL");
    return Number(r?.n || 0);
  }
  if (segment === "active") {
    const r = await one("SELECT count(*) AS n FROM leads WHERE deleted_at IS NULL AND chat_id IS NOT NULL AND status != 'closed'");
    return Number(r?.n || 0);
  }
  if (segment === "new_leads") {
    const r = await one("SELECT count(*) AS n FROM leads WHERE deleted_at IS NULL AND chat_id IS NOT NULL AND COALESCE(status,'new')='new' AND created_at > now()-interval '30 days'");
    return Number(r?.n || 0);
  }
  if (segment === "members") {
    const r = await one("SELECT count(*) AS n FROM kompas_users WHERE role='member' AND status='active'");
    return Number(r?.n || 0);
  }
  return 0;
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const preview = new URL(req.url).searchParams.get("preview");

  if (preview) {
    const n = await segmentCount(preview);
    return NextResponse.json({ count: n });
  }

  const rows = await q(`
    SELECT b.id, b.title, b.body, b.segment, b.channel, b.status,
           b.sent_count, b.failed_count, b.scheduled_at, b.sent_at, b.created_at,
           u.full_name AS created_by_name
    FROM kompas_broadcasts b
    LEFT JOIN kompas_users u ON u.id = b.created_by
    ORDER BY b.created_at DESC LIMIT 50`);

  return NextResponse.json({ broadcasts: rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: {
    title?: unknown; body?: unknown; segment?: unknown;
    channel?: unknown; scheduled_at?: unknown;
  } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title || !body.body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  const segment = String(body.segment || "all");
  const channel = String(body.channel || "telegram");
  const userId = (auth.user as any)?.sub ? Number((auth.user as any).sub) : null;

  const row = await one(
    `INSERT INTO kompas_broadcasts (title, body, segment, channel, scheduled_at, created_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [
      String(body.title),
      String(body.body),
      segment,
      channel,
      body.scheduled_at ? new Date(String(body.scheduled_at)) : null,
      userId || null,
    ],
  );

  return NextResponse.json({ id: row?.id });
}
