/* GET /api/admin/auth/me — данные текущего пользователя. */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: { id: user.sub, email: user.email, role: user.role, name: user.name },
  });
}
