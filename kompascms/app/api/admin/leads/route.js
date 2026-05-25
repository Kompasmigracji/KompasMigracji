/* /api/admin/leads — список лидов (GET) и смена статуса (PATCH). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = new URL(req.url).searchParams.get("status") || "";
  const rows = await q(
    `select id, source, name, contact, message, status, created_at
     from kompas_leads
     where ($1 = '' or status = $1)
     order by created_at desc
     limit 200`,
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
  await q("update kompas_leads set status = $2 where id = $1", [b.id, b.status]);
  return NextResponse.json({ ok: true });
}
