/* /api/admin/content — блоки контента сайта: список (GET) и сохранение (PUT).
   Юридический чек-лист kompasmigracji.com: offer / pricing / regulamin / privacy. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/* GET — все блоки контента (admin и moderator видят, правит только admin). */
export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const blocks = await q(
    `select c.id, c.slug, c.title, c.body, c.published, c.updated_at,
            u.full_name as updated_by_name
     from kompas_content c
     left join kompas_users u on u.id = c.updated_by
     order by c.id`
  );
  return NextResponse.json({ blocks });
}

/* PUT — сохранить/опубликовать блок. Создаёт блок, если slug новый. */
export async function PUT(req) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const slug = String(b.slug || "").trim();
  if (!slug) return NextResponse.json({ error: "Нужен slug блока" }, { status: 400 });

  const published = typeof b.published === "boolean" ? b.published : null;

  const row = await one(
    `insert into kompas_content (slug, title, body, published, updated_by, updated_at)
     values ($1, coalesce($2, $1), coalesce($3, ''), coalesce($4, false), $5, now())
     on conflict (slug) do update set
       title      = coalesce($2, kompas_content.title),
       body       = coalesce($3, kompas_content.body),
       published  = coalesce($4, kompas_content.published),
       updated_by = $5,
       updated_at = now()
     returning id, slug, title, body, published, updated_at`,
    [slug, b.title ?? null, b.body ?? null, published, auth.user.sub]
  );

  await q(
    `insert into kompas_audit_log (user_id, action, entity, entity_id, meta)
     values ($1, 'content.update', 'content', $2, $3)`,
    [auth.user.sub, slug, JSON.stringify({ published: row.published })]
  );

  return NextResponse.json({ ok: true, block: row });
}
