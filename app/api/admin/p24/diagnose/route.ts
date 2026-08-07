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
    /* Формулювання звірені з офіційною специфікацією P24 (розділ
       «API integration»): назви полів у панелі саме такі, і найчастіша
       помилка — покласти в secretId ключ CRC замість ключа до звітів. */
    checklist: [
      "Панель P24 → Moje konto → Moje dane → «Dane API i konfiguracja»",
      "user (posId/login) = P24_MERCHANT_ID — ID акаунта з листа про реєстрацію",
      "secretId (API key) = P24_API_KEY — це «klucz do raportów», НЕ ключ CRC",
      "CRC = P24_CRC — окреме поле, окремий ключ",
      "Продакшен і sandbox мають ДВА різні комплекти всіх трьох значень",
      "Поле «Adresy IP» має покривати адреси Vercel (динамічні) — інакше 401",
      "P24_SANDBOX=false у продакшені",
      "TransactionVerify входить у типовий набір Web Services; якщо його вимкнено — це вмикає менеджер акаунта P24",
    ],
  });
}
