export const dynamic = "force-dynamic";
/* /api/admin/leads — лиды из таблицы leads (бот + сайт).
   GET:    список активных лидов (deleted_at IS NULL) с фильтром по статусу.
   PATCH:  смена статуса лида.
   DELETE: мягкое удаление (переместить в корзину — устанавливает deleted_at). */
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
       CASE
         WHEN chat_id IS NOT NULL THEN 'bot'
         WHEN source = 'main'     THEN 'site'
         WHEN source IS NOT NULL AND source != '' THEN source
         ELSE 'site'
       END AS source,
       COALESCE(first_name, '') AS name,
       COALESCE(contact, '')    AS contact,
       COALESCE(message, situation, '') AS message,
       COALESCE(status, 'new')  AS status,
       country,
       service,
       urgency,
       username,
       chat_id,
       created_at
     FROM leads
     WHERE deleted_at IS NULL
       AND ($1 = '' OR COALESCE(status, 'new') = $1)
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
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id || !b.status) {
    return NextResponse.json({ error: "Нужны id и status" }, { status: 400 });
  }
  await q("UPDATE leads SET status = $2 WHERE id = $1 AND deleted_at IS NULL", [b.id, b.status]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!b.id) {
    return NextResponse.json({ error: "Нужен id" }, { status: 400 });
  }
  // Soft-delete: переместить в корзину
  await q("UPDATE leads SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", [b.id]);
  return NextResponse.json({ ok: true });
}

export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try { b = await req.json(); } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const name = (b.name || "").trim();
  const contact = (b.contact || "").trim();
  const service = (b.service || "").trim();
  const source = b.source || "site";
  const status = b.status || "new";

  if (!name || !contact) {
    return NextResponse.json({ error: "Ім'я та контакт обов'язкові" }, { status: 400 });
  }

  // Insert into leads
  const rows = await q(
    `INSERT INTO leads (first_name, contact, source, service, status, created_at)
     VALUES ($1, $2, $3, $4, $5, now())
     RETURNING id, first_name AS name, contact, source, service, status, created_at`,
    [name, contact, source, service, status]
  );

  // Mirror to kompas_leads
  try {
    await q(
      `INSERT INTO kompas_leads (source, name, contact, status)
       VALUES ($1, $2, $3, $4)`,
      [source, name, contact, status]
    );
  } catch (e) {
    console.error("Mirror to kompas_leads failed", e);
  }
  
  // Create timeline note
  try {
    const activityBody = \`Джерело: \${source}\\nПослуга: \${service || 'не вказано'}\`;
    await q(
      \`INSERT INTO kompas_activities (entity_type, entity_id, type, title, body) VALUES ('lead', $1, 'system', 'Лід створено вручну', $2)\`,
      [rows[0].id, activityBody]
    );
  } catch(e) {
    console.error("Timeline activity failed", e);
  }

  return NextResponse.json({ lead: rows[0] });
}
