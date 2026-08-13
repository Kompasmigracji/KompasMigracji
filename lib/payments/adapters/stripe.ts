import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { POST as stripeWebhook } from './stripe_webhook';
import { PaymentAdapter, TransactionData } from '../types';

export const stripeAdapter: PaymentAdapter = {
  async registerTransaction(data: TransactionData) {
    if (!stripe) throw new Error("Stripe not configured");
    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.kompasmigracji.com').replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik'],
      line_items: [{
        price_data: { currency: 'pln', product_data: { name: data.description }, unit_amount: data.amount },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${siteUrl}/payment/success?session=${data.sessionId}`,
      cancel_url: `${siteUrl}/pricing`,
      customer_email: data.email,
      client_reference_id: data.sessionId,
      metadata: { sessionId: data.sessionId, source: data.source || 'pricing' },
    });
    return session.url!;
  },
  async handleWebhook(req: NextRequest) {
    return stripeWebhook(req);
  }
};
