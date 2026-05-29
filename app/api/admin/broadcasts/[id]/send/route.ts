/* F8: Telegram bulk broadcast execution
   F9: Auto delivery stats update after send */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";

async function getRecipients(segment: string): Promise<Array<{ chat_id: string; name: string }>> {
  if (segment === "all" || segment === "active" || segment === "new_leads") {
    const filter = segment === "active"
      ? "AND status != 'closed'"
      : segment === "new_leads"
        ? "AND COALESCE(status,'new')='new' AND created_at > now()-interval '30 days'"
        : "";
    return q(
      `SELECT chat_id::text AS chat_id, COALESCE(first_name, 'Клієнт') AS name
       FROM leads WHERE deleted_at IS NULL AND chat_id IS NOT NULL ${filter}`,
    );
  }
  if (segment === "members") {
    // Members without Telegram — skip for now (no chat_id stored)
    return [];
  }
  return [];
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const broadcastId = Number(params.id);
  const broadcast = await one(
    "SELECT * FROM kompas_broadcasts WHERE id=$1",
    [broadcastId],
  );

  if (!broadcast) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (broadcast.status === "sending" || broadcast.status === "sent") {
    return NextResponse.json({ error: "Already sent" }, { status: 409 });
  }

  // Mark as sending
  await q("UPDATE kompas_broadcasts SET status='sending' WHERE id=$1", [broadcastId]);

  const recipients = await getRecipients(String(broadcast.segment));

  let sent = 0;
  let failed = 0;

  // F8: Send to each recipient (rate-limited: 30/sec Telegram limit)
  for (const r of recipients) {
    try {
      const text = String(broadcast.body).replace(/\{\{name\}\}/g, r.name);
      await sendMessage(r.chat_id, text, "HTML");
      sent++;
      // Telegram rate limit: ~30 msg/sec
      if (sent % 25 === 0) await new Promise(res => setTimeout(res, 1000));
    } catch {
      failed++;
    }
  }

  // F9: Auto update delivery stats
  await q(
    `UPDATE kompas_broadcasts
     SET status='sent', sent_count=$2, failed_count=$3, sent_at=now()
     WHERE id=$1`,
    [broadcastId, sent, failed],
  );

  return NextResponse.json({ ok: true, sent, failed, total: recipients.length });
}
