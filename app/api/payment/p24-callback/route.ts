import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { generateInvoice } from "@/lib/invoices";
import { calculateCommission } from "@/lib/commissions";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Przelewy24 sends sessionId which we can assume maps to dueId or a payment reference
    const dueId = data.sessionId; 
    const amountPaid = data.amount;
    
    if (!dueId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Mark kompas_dues as paid
    const updatedDue = await one(`
      UPDATE kompas_dues 
      SET paid = true, updated_at = NOW()
      WHERE id = $1
      RETURNING id, lead_id, amount, service_slug
    `, [dueId]) as { id: string; lead_id: string; amount: number; service_slug: string } | null;

    if (!updatedDue) {
      return NextResponse.json({ error: "Due not found or already paid" }, { status: 404 });
    }

    // Generate Invoice
    await generateInvoice(updatedDue.id, updatedDue.amount, updatedDue.lead_id);

    // Calculate Commission
    await calculateCommission(updatedDue.id, updatedDue.amount, updatedDue.service_slug, updatedDue.lead_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("p24-callback error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
