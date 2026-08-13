import { NextRequest, NextResponse } from 'next/server';
import { przelewy24Adapter } from '@/lib/payments/adapters/przelewy24';
import { payuAdapter } from '@/lib/payments/adapters/payu';
import { stripeAdapter } from '@/lib/payments/adapters/stripe';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider;
  if (provider === 'przelewy24') return przelewy24Adapter.handleWebhook(req);
  if (provider === 'payu') return payuAdapter.handleWebhook(req);
  if (provider === 'stripe') return stripeAdapter.handleWebhook(req);
  
  return NextResponse.json({ error: 'Unknown provider' }, { status: 404 });
}
