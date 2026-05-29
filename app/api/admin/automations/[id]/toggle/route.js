/* POST /api/admin/automations/:id/toggle */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = params;
  const { enabled } = await req.json().catch(() => ({}));

  await q(
    `INSERT INTO automation_states (id, enabled, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET enabled = $2, updated_at = NOW()`,
    [id, !!enabled]
  ).catch(() => {});

  return NextResponse.json({ ok: true, enabled: !!enabled });
}
