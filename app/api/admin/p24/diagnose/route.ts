export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/* GET /api/admin/p24/diagnose — чому Przelewy24 віддає 401.
 *
 * Існує через 07.08.2026: transaction/register проходив (клієнт бачив сторінку
 * BLIK і платив), а transaction/verify на тих самих креденшелах повертав
 * 401 Incorrect authentication. З логів це не розрізнити — P24 віддає той
 * самий 401 і коли ключ не той, і коли IP не в білому списку, і коли ключ
 * від іншого середовища.
 *
 * testAccess перевіряє рівно доступ і нічого більше. Тому:
 *   testAccess 401 → проблема в ключах або IP (див. hint)
 *   testAccess 200 + verify 401 → доступ нормальний, дивись CRC і підпис
 *
 * Секрети не повертаються — лише останні 4 символи, щоб очима звірити
 * з панеллю P24 і не полізти міняти те, що й так правильне. */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { diagnoseAccess } from "@/lib/przelewy24";
import { q } from "@/lib/db";

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const access = await diagnoseAccess();

  /* Скільки платежів зараз висить непідтвердженими — щоб було видно ціну
     питання в злотих, а не тільки код помилки. */
  const stuck = await q(
    `SELECT status, count(*)::int AS n, COALESCE(sum(amount_grosz),0)::int AS grosz
       FROM kompas_payments
      WHERE status IN ('pending','verify_failed')
      GROUP BY status`,
  );

  return NextResponse.json({
    access,
    unresolvedPayments: stuck.map((r: any) => ({
      status: r.status,
      count:  r.n,
      amount: `${(r.grosz / 100).toFixed(2)} PLN`,
    })),
    checklist: [
      "Panel P24 → Moje dane → Konfiguracja → API: POS ID = P24_MERCHANT_ID",
      "Там же «Klucz do API» = P24_API_KEY (окремий для sandbox і продакшену)",
      "Там же «Adresy IP» = % — Vercel ходить з динамічних egress-IP",
      "Klucz CRC = P24_CRC (теж окремий для sandbox і продакшену)",
      "P24_SANDBOX=false у продакшені",
    ],
  });
}
