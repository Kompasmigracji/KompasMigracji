/* /api/admin/members/[id] — карточка участника: GET / PATCH / DELETE.
   GET доступен админу/модератору для любого участника и самому участнику для себя. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const { id } = await params;
  const auth = await requireAuth(["admin", "moderator", "member"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // участник может смотреть только свой кабинет
  if (auth.user.role === "member" && String(auth.user.sub) !== String(id)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const member = await one(
    `select u.id, u.full_name, u.email, u.phone, u.status, u.created_at, u.last_login,
            p.member_no, p.category, p.city, p.country, p.join_date, p.dues_status, p.notes
     from kompas_users u
     left join kompas_member_profiles p on p.user_id = u.id
     where u.id = $1 and u.role = 'member'`,
    [id]
  );
  if (!member) return NextResponse.json({ error: "Участник не найден" }, { status: 404 });

  const dues = await q(
    "select id, period, amount, paid, paid_at from kompas_dues where user_id = $1 order by period desc",
    [id]
  );
  const cases = await q(
    "select id, title, status, created_at from kompas_cases where user_id = $1 order by created_at desc",
    [id]
  );
  return NextResponse.json({ member, dues, cases });
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const auth = await requireAuth(["admin", "moderator", "member"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // участник профсоюза может править только свой кабинет — и только контакты
  const isSelf = String(auth.user.sub) === String(id);
  if (auth.user.role === "member" && !isSelf) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  let raw;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  // участнику доступны только телефон и город; админу/модератору — все поля
  const b = auth.user.role === "member"
    ? { phone: raw.phone, city: raw.city }
    : raw;

  if (b.full_name !== undefined || b.phone !== undefined || b.status !== undefined) {
    await q(
      `update kompas_users set
         full_name = coalesce($2, full_name),
         phone     = coalesce($3, phone),
         status    = coalesce($4, status)
       where id = $1 and role = 'member'`,
      [id, b.full_name ?? null, b.phone ?? null, b.status ?? null]
    );
  }
  await q(
    `update kompas_member_profiles set
       category    = coalesce($2, category),
       city        = coalesce($3, city),
       dues_status = coalesce($4, dues_status),
       notes       = coalesce($5, notes)
     where user_id = $1`,
    [id, b.category ?? null, b.city ?? null, b.dues_status ?? null, b.notes ?? null]
  );
  await q(
    "insert into kompas_audit_log (user_id, action, entity, entity_id) values ($1, 'member.update', 'member', $2)",
    [auth.user.sub, String(id)]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await q("delete from kompas_users where id = $1 and role = 'member'", [id]);
  await q(
    "insert into kompas_audit_log (user_id, action, entity, entity_id) values ($1, 'member.delete', 'member', $2)",
    [auth.user.sub, String(id)]
  );
  return NextResponse.json({ ok: true });
}
