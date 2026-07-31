/* Server-side source of truth for fixed-price services sold via /api/payment.
   The client UI sends a `serviceId`, not a raw amount — /api/payment looks the
   price up here, so a tampered client-side `amount` can never buy a real
   service for less than its real price. Keep in sync with the amountGrosze
   values in app/[locale]/pricing/page.tsx (psvc_*, pricing_hero) and
   app/[locale]/karta/page.tsx (karta_p1/karta_p2) — those are display only. */
export const PRICE_CATALOG: Record<string, number> = {
  // pricing page — notary (psvc_n*)
  psvc_n1: 25000, psvc_n2: 35000, psvc_n3: 35500, psvc_n4: 35500, psvc_n5: 26000,
  psvc_n6: 38000, psvc_n7: 35500, psvc_n8: 72000, psvc_n9: 58000, psvc_n10: 15000,
  // pricing page — legalization (psvc_l*)
  psvc_l1: 95000, psvc_l2: 140000, psvc_l3: 80000, psvc_l4: 180000, psvc_l5: 180000,
  psvc_l6: 200000, psvc_l7: 250000, psvc_l8: 400000, psvc_l9: 35500, psvc_l10: 90000,
  psvc_l11: 90000, psvc_l12: 15000, psvc_l13: 35500,
  // pricing page — marriage (psvc_m2/psvc_m4 have no fixed price, not sold here)
  psvc_m1: 80000, psvc_m3: 180000,
  // pricing page — translations (psvc_t2 has no fixed price)
  psvc_t1: 10000, psvc_t3: 2500, psvc_t4: 3500,
  // pricing page — bureaucracy (psvc_b*)
  psvc_b1: 80000, psvc_b2: 35500, psvc_b3: 15000, psvc_b4: 15000, psvc_b5: 15000, psvc_b6: 15000,
  // pricing page — legal (only leg2 has a fixed price, the rest are "contact us")
  psvc_leg2: 160000,
  // pricing page — hero CTA
  pricing_hero: 45000,
  // karta page — acceleration packages
  karta_p1: 35500,
  karta_p2: 90000,
};

export function getServicePrice(serviceId: string): number | null {
  return Object.prototype.hasOwnProperty.call(PRICE_CATALOG, serviceId)
    ? PRICE_CATALOG[serviceId]
    : null;
}
