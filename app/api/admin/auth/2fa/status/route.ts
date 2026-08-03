import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { one } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });

  const user = await one("select two_factor_enabled from kompas_users where id = $1", [auth.user.sub]);
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enabled: !!user.two_factor_enabled });
}
