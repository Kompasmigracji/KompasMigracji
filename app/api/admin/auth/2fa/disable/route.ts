import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q, one } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { password } = body;
  if (!password) {
    return NextResponse.json({ error: "Для отключения 2FA требуется пароль" }, { status: 400 });
  }

  const userId = auth.user.sub;
  const user = await one("select * from kompas_users where id = $1", [userId]);
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  // Disable 2FA
  await q("update kompas_users set two_factor_enabled = false, two_factor_secret = null where id = $1", [userId]);
  await q("insert into kompas_audit_log (user_id, action, entity) values ($1, 'disable_2fa', 'user')", [userId]);

  return NextResponse.json({
    ok: true,
    message: "2FA успешно отключена"
  });
}
