export const dynamic = "force-dynamic";
/* /api/admin/leads/[id]/payment-link
   POST { amount_pln, description?, email? }
   → реєструє транзакцію в PayU
   → зберігає session_id у leads
   → повертає { paymentUrl, sessionId } */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createPayUOrder } from "@/lib/payu";
import { isP24Configured, registerTransaction } from "@/lib/przelewy24";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const leadId = params.id;

  /* ── Знайти лід ─────────────────────────────────────────────────── */
  type LeadRow = { id: string; first_name: string | null; service: string | null };
  const lead = (await one(
    `SELECT id, first_name, service
       FROM leads
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1`,
    [leadId],
  )) as LeadRow | null;

  if (!lead) {
    return NextResponse.json({ error: "Лід не знайдено" }, { status: 404 });
  }

  /* ── Тіло запиту ────────────────────────────────────────────────── */
  let body: { amount_pln?: number; description?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const { amount_pln, description, email } = body;

  if (!amount_pln || isNaN(amount_pln) || amount_pln <= 0) {
    return NextResponse.json(
      { error: "Вкажіть суму (amount_pln > 0)" },
      { status: 400 },
    );
  }

  /* ── Параметри транзакції ───────────────────────────────────────── */
  const amountGroszy = Math.round(amount_pln * 100); // 1 PLN = 100 groszy
  const sessionId    = randomUUID();
  const appUrl       = (process.env.NEXT_PUBLIC_APP_URL ?? "https://kompas-migracji.vercel.app").replace(/\/$/, "");

  const finalDescription = description?.trim() || `Usługa: ${lead.service ?? "KompasMigracji"}`;
  const finalEmail       = email?.trim()       || "client@kompas-migracji.pl";

  try {
    const result = isP24Configured()
      ? await registerTransaction({
          sessionId,
          amount:      amountGroszy,
          description: finalDescription,
          email:       finalEmail,
          urlReturn:   `${appUrl}/payment/success`,
          urlStatus:   `${appUrl}/api/payment-notify`,
        }).then(r => ({ redirectUrl: r.paymentUrl, orderId: r.sessionId }))
      : await createPayUOrder({
          sessionId,
          amount:      amountGroszy,
          description: finalDescription,
          email:       finalEmail,
          continueUrl: `${appUrl}/payment/success`,
          notifyUrl:   `${appUrl}/api/payu/notify`,
        });

    /* ── Зберегти session_id у лідові ───────────────────────────── */
    await q(
      `UPDATE leads SET session_id = $1 WHERE id = $2`,
      [sessionId, leadId],
    );

    return NextResponse.json({
      paymentUrl: result.redirectUrl,
      sessionId:  result.orderId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("payment-link error:", err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
