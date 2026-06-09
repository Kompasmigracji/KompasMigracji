import { q } from "./db";

export async function generateInvoice(dueId: string, amount: number, leadId: string) {
  // Simulate VAT invoice generation (e.g. via Fakturownia API)
  const invoiceNumber = `INV-${Date.now()}`;
  const pdfUrl = `https://fakturownia.mock/api/invoices/${invoiceNumber}.pdf`;

  // Save to kompas_invoices
  // Ensure the table exists
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS kompas_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        due_id UUID NOT NULL,
        lead_id UUID NOT NULL,
        amount NUMERIC NOT NULL,
        invoice_number TEXT NOT NULL,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (err) {
    // ignore
  }

  await q(`
    INSERT INTO kompas_invoices (due_id, lead_id, amount, invoice_number, pdf_url)
    VALUES ($1, $2, $3, $4, $5)
  `, [dueId, leadId, amount, invoiceNumber, pdfUrl]);

  return { invoiceNumber, pdfUrl };
}
