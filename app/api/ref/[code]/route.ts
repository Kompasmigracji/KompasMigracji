/* F5: Referral click tracking + redirect
   GET /api/ref/KM3X9A → increments click count → redirects to /
   When a lead signs up with ref_code, F6 fires (handled in lead creation) */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  const code = (params.code || "").toUpperCase();
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com").replace(/\/$/, "");

  const ref = await one("SELECT id FROM kompas_referrals WHERE code=$1", [code]);
  if (ref) {
    // F5: Auto-increment click counter
    await q("UPDATE kompas_referrals SET clicks = clicks + 1 WHERE id=$1", [ref.id]);
  }

  const dest = new URL(`${siteUrl}/`);
  dest.searchParams.set("utm_source", "referral");
  dest.searchParams.set("utm_medium", "ref");
  dest.searchParams.set("ref", code);

  return NextResponse.redirect(dest.toString(), 302);
}
