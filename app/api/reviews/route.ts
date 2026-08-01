import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const LOCALES = ["uk", "pl", "en", "ru", "rom"];

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "uk";
  if (!LOCALES.includes(locale) || !supabase) {
    return NextResponse.json({ reviews: [] });
  }

  const { data, error } = await supabase
    .from("kompas_reviews")
    .select("author_name, review_text, rating, review_date, source_url")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[api/reviews] fetch failed:", error);
    return NextResponse.json({ reviews: [] });
  }

  return NextResponse.json({ reviews: data ?? [] });
}
