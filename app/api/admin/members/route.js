export const dynamic = "force-dynamic";
/* /api/admin/members — список (GET) и создание участника профсоюза (POST). */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth, hashPassword, tempPassword } from "@/lib/auth";

/* GET — список участников с поиском ?search= */
export async function GET(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const search = (new URL(req.url).searchParams.get("search") || "").trim();
  const like = "%" + search + "%";

  const rows = await q(
    `select u.id, u.full_name, u.email, u.phone, u.status, u.created_at,
            p.member_no, p.category, p.city, p.dues_status, p.join_date
     from kompas_users u
     left join kompas_member_profiles p on p.user_id = u.id
     where (u.role = 'member' or p.user_id is not null)
       and ($1 = '' or u.full_name ilike $2 or u.email ilike $2 or p.member_no ilike $2)
     order by u.created_at desc
     limit 200`,
    [search, like]
  );
  return NextResponse.json({ members: rows });
}

/* POST — создать участника. Возвращает временный пароль один раз. */
export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const email = String(b.email || "").toLowerCase().trim();
  const fullName = String(b.full_name || "").trim();
  if (!email || !fullName) {
    return NextResponse.json({ error: "Имя и email обязательны" }, { status: 400 });
  }
  let user = await one("select id from kompas_users where email = $1", [email]);
  let pwd;
  
  if (user) {
    const profileExists = await one("select user_id from kompas_member_profiles where user_id = $1", [user.id]);
    if (profileExists) {
      return NextResponse.json({ error: "Користувач вже є учасником профспілки" }, { status: 409 });
    }
  } else {
    pwd = b.password ? String(b.password) : tempPassword();
    const hash = await hashPassword(pwd);

    user = await one(
      `insert into kompas_users (email, password_hash, full_name, role, status, phone)
       values ($1, $2, $3, 'member', 'active', $4)
       returning id`,
      [email, hash, fullName, b.phone || null]
    );
  }

  const memberNo = "KM-" + String(user.id).padStart(5, "0");
  await q(
    `insert into kompas_member_profiles (user_id, member_no, category, city)
     values ($1, $2, $3, $4)`,
    [user.id, memberNo, b.category || "standard", b.city || null]
  );
  await q(
    "insert into kompas_audit_log (user_id, action, entity, entity_id) values ($1, 'member.create', 'member', $2)",
    [auth.user.sub, String(user.id)]
  );

  return NextResponse.json({
    ok: true,
    id: user.id,
    member_no: memberNo,
    temp_password: pwd,
  });
}
