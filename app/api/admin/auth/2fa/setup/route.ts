import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { q, one } from "@/lib/db";
import { generate2FASecret } from "@/lib/totp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });

  const userId = auth.user.sub;
  const user = await one("select * from kompas_users where id = $1", [userId]);
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  // Generate new secret
  const { secret, uri } = generate2FASecret(user.email);

  // Store it but do NOT enable it yet
  await q("update kompas_users set two_factor_secret = $1 where id = $2", [secret, userId]);

  return NextResponse.json({
    ok: true,
    secret,
    uri,
    message: "Secret generated. Please verify with a code to enable 2FA."
  });
}
