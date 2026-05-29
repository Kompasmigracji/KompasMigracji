/* Innovation 5: Smart Lead Scoring
   F13: Auto score (0-100) based on urgency + service + completeness
   F14: Auto-assign to least-busy active moderator */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function calcScore(lead: {
  urgency?: string; service?: string; contact?: string;
  situation?: string; chat_id?: string;
}): number {
  let score = 20; // base

  // Urgency factor (+30)
  if (lead.urgency === "high" || lead.urgency === "urgent") score += 30;
  else if (lead.urgency === "medium") score += 15;

  // Service value (+20)
  const highValueServices = ["pobyt_staly", "pobyt_czasowy", "obywatelstwo"];
  if (lead.service && highValueServices.includes(lead.service)) score += 20;
  else if (lead.service) score += 10;

  // Contact completeness (+15)
  if (lead.contact) score += 15;

  // Message/situation completeness (+10)
  if (lead.situation && lead.situation.length > 30) score += 10;

  // Telegram (warm lead) (+5)
  if (lead.chat_id) score += 5;

  return Math.min(100, score);
}

// F14: Round-robin auto-assign to least-busy moderator
async function autoAssign(): Promise<number | null> {
  const workers = await q(`
    SELECT u.id, count(l.auto_assigned_to) AS load
    FROM kompas_users u
    LEFT JOIN leads l ON l.auto_assigned_to = u.id AND l.deleted_at IS NULL
      AND COALESCE(l.status,'new') IN ('new','in_progress')
    WHERE u.role IN ('admin','moderator') AND u.status='active'
    GROUP BY u.id
    ORDER BY load ASC, u.id ASC
    LIMIT 1`);

  return workers[0] ? Number(workers[0].id) : null;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { leadId?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const leadId = Number(body.leadId);
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  const lead = await one(
    "SELECT id, urgency, service, contact, situation, chat_id FROM leads WHERE id=$1 AND deleted_at IS NULL",
    [leadId],
  );
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  // F13: Calculate score
  const score = calcScore(lead);

  // F14: Auto-assign
  const assignedTo = await autoAssign();

  await q(
    "UPDATE leads SET score=$2, auto_assigned_to=$3 WHERE id=$1",
    [leadId, score, assignedTo],
  );

  return NextResponse.json({ score, assignedTo });
}

// Bulk score all unscored leads
export async function PUT() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const unscored = await q(
    "SELECT id, urgency, service, contact, situation, chat_id FROM leads WHERE deleted_at IS NULL AND score=0 LIMIT 500",
  );

  let updated = 0;
  for (const lead of unscored) {
    const score = calcScore(lead);
    await q("UPDATE leads SET score=$2 WHERE id=$1", [lead.id, score]);
    updated++;
  }

  return NextResponse.json({ updated });
}
