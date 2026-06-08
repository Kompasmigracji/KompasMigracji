export const dynamic = "force-dynamic";
// F1: Subscription plans API — public endpoint, no auth required
export const revalidate = 3600;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function GET() {
  try {
    // 2-second query timeout to prevent API hangs and ensure fast fallback
    const dbPromise = q(
      `SELECT id, name, slug, price_pln, price_eur, billing_cycle, features, is_popular, sort_order
       FROM kompas_subscription_plans
       WHERE is_active = true
       ORDER BY sort_order ASC`,
    );
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), 2000)
    );
    const plans = await Promise.race([dbPromise, timeoutPromise]);

    if (!plans || plans.length === 0) {
      throw new Error("No active subscription plans found in DB");
    }

    return NextResponse.json({ plans });
  } catch (err: any) {
    console.error("[api/plans] Error or timeout retrieving plans:", err?.message || err);
    // Fallback static plans if DB unavailable or slow
    return NextResponse.json({
      plans: [
        {
          id: 1, name: "Basic", slug: "basic", price_pln: 49, price_eur: 12,
          billing_cycle: "monthly", is_popular: false,
          features: ["Konsultacja online 30 min", "Dostep do poradnikow PDF", "Bot Telegram 24/7", "Status sprawy online"],
        },
        {
          id: 2, name: "Standard", slug: "standard", price_pln: 149, price_eur: 35,
          billing_cycle: "monthly", is_popular: true,
          features: ["Wszystko z Basic", "Konsultacja 60 min/mies.", "Dedykowany doradca", "Priorytetowa obsluga", "Powiadomienia Telegram"],
        },
        {
          id: 3, name: "Premium", slug: "premium", price_pln: 349, price_eur: 82,
          billing_cycle: "monthly", is_popular: false,
          features: ["Wszystko z Standard", "Nieograniczone konsultacje", "Reprezentacja prawna", "Przygotowanie dokumentow", "Gwarancja rezultatu"],
        },
      ],
    });
  }
}
