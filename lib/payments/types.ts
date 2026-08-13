export interface TransactionData {
  sessionId: string;
  amount: number;
  currency: string;
  email: string;
  description: string;
  language?: string;
  [key: string]: any;
}

export interface PaymentAdapter {
  registerTransaction(data: TransactionData): Promise<string>;
  handleWebhook(req: Request): Promise<Response>;
}
