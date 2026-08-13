import { NextRequest } from 'next/server';
import { createPayUOrder } from '@/lib/payu';
import { POST as payuWebhook } from './payu_webhook';
import { PaymentAdapter, TransactionData } from '../types';

export const payuAdapter: PaymentAdapter = {
  async registerTransaction(data: TransactionData) {
    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.kompasmigracji.com').replace(/\/$/, '');
    const res = await createPayUOrder({
      sessionId: data.sessionId,
      amount: data.amount,
      description: data.description,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      lang: data.language || 'pl',
      notifyUrl: `${siteUrl}/api/webhooks/payment/payu`,
      continueUrl: `${siteUrl}/payment/success?session=${data.sessionId}`,
    });
    return res.redirectUrl;
  },
  async handleWebhook(req: NextRequest) {
    return payuWebhook(req);
  }
};
