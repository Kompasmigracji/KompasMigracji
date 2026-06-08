export const dynamic = "force-dynamic";
/* GET  /api/admin/members/:id — профиль участника с взносами и делами.
   PATCH /api/admin/members/:id — обновить телефон и город.
   Доступ: admin/moderator видят любого; member — только себя. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(_req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "member"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = params.id;

  // member видит только свои данные
  if (auth.user.role === "member" && String(auth.user.sub) !== String(id)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const member = await one(
    `select u.id, u.email, u.full_name, u.phone, u.status, u.created_at,
            p.member_no, p.category, p.city, p.country, p.join_date, p.dues_status
     from kompas_users u
     left join kompas_member_profiles p on p.user_id = u.id
     where u.id = $1 and u.role = 'member'`,
    [id]
  );
  if (!member) {
    return NextResponse.json({ error: "Участник не найден" }, { status: 404 });
  }

  const dues = await q(
    `select id, period, amount, paid, paid_at
     from kompas_dues where user_id = $1 order by period desc limit 24`,
    [id]
  );
  const cases = await q(
    `select id, title, status, created_at
     from kompas_cases where user_id = $1 order by created_at desc`,
    [id]
  );

  return NextResponse.json({ member, dues, cases });
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(["admin", "moderator", "member"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = params.id;

  // member обновляет только себя
  if (auth.user.role === "member" && String(auth.user.sub) !== String(id)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // Обновляем phone в kompas_users
  if (b.phone !== undefined) {
    const phone = String(b.phone).trim() || null;
    await q("update kompas_users set phone = $2 where id = $1", [id, phone]);
  }

  // Обновляем city в kompas_member_profiles
  if (b.city !== undefined) {
    const city = String(b.city).trim() || null;
    await q("update kompas_member_profiles set city = $2 where user_id = $1", [id, city]);
  }

  // admin/moderator могут также менять статус, категорию, взносы
  if ((auth.user.role === "admin" || auth.user.role === "moderator") && b.status) {
    await q("update kompas_users set status = $2 where id = $1", [id, b.status]);
  }
  if (auth.user.role === "admin" && b.category) {
    await q("update kompas_member_profiles set category = $2 where user_id = $1", [id, b.category]);
  }
  if (auth.user.role === "admin" && b.dues_status) {
    await q("update kompas_member_profiles set dues_status = $2 where user_id = $1", [id, b.dues_status]);
  }

  return NextResponse.json({ ok: true });
}
