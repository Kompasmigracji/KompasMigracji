import { NextRequest } from 'next/server';
import { registerTransaction as p24Register, toP24Language } from '@/lib/przelewy24';
import { POST as p24Webhook } from './przelewy24_webhook';
import { PaymentAdapter, TransactionData } from '../types';

export const przelewy24Adapter: PaymentAdapter = {
  async registerTransaction(data: TransactionData) {
    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.kompasmigracji.com').replace(/\/$/, '');
    const res = await p24Register({
      sessionId: data.sessionId,
      amount: data.amount,
      description: data.description,
      email: data.email,
      urlReturn: `${siteUrl}/payment/success?session=${data.sessionId}`,
      urlStatus: `${siteUrl}/api/webhooks/payment/przelewy24`,
      language: toP24Language(data.language),
    });
    return res.paymentUrl;
  },
  async handleWebhook(req: NextRequest) {
    return p24Webhook(req);
  }
};
