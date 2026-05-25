/* /api/admin/leads — лиды из существующей таблицы leads (бот + сайт).
   Адаптировано для KompasCMS: маппим поля leads → компас CMS-формат.
   GET: список с фильтром по статусу. PATCH: смена статуса. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = new URL(req.url).searchParams.get("status") || "";

  const rows = await q(
    `SELECT
       id,
       CASE WHEN chat_id IS NOT NULL THEN 'bot' ELSE 'site' END AS source,
       COALESCE(first_name, name)    AS name,
       COALESCE(contact, phone)      AS contact,
       COALESCE(situation, message)  AS message,
       COALESCE(status, 'new')       AS status,
       country,
       service,
       urgency,
       username,
       created_at
     FROM leads
     WHERE ($1 = '' OR COALESCE(status, 'new') = $1)
     ORDER BY created_at DESC
     LIMIT 300`,
    [status]
  );
  return NextResponse.json({ leads: rows });
}

export async function PATCH(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id || !b.status) {
    return NextResponse.json({ error: "Нужны id и status" }, { status: 400 });
  }
  await q("UPDATE leads SET status = $2 WHERE id = $1", [b.id, b.status]);
  return NextResponse.json({ ok: true });
}
