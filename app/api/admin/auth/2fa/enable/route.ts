import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q, one } from "@/lib/db";
import { verify2FA } from "@/lib/totp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { code } = body;
  if (!code) {
    return NextResponse.json({ error: "Требуется код" }, { status: 400 });
  }

  const userId = auth.user.sub;
  const user = await one("select * from kompas_users where id = $1", [userId]);
  if (!user || !user.two_factor_secret) {
    return NextResponse.json({ error: "Настройка 2FA не была инициализирована" }, { status: 400 });
  }

  const isValid = verify2FA(code, user.two_factor_secret);
  if (!isValid) {
    return NextResponse.json({ error: "Неверный код" }, { status: 400 });
  }

  // Enable 2FA
  await q("update kompas_users set two_factor_enabled = true where id = $1", [userId]);
  await q("insert into kompas_audit_log (user_id, action, entity) values ($1, 'enable_2fa', 'user')", [userId]);

  return NextResponse.json({
    ok: true,
    message: "2FA успешно включена"
  });
}
