import { POST as postPayment } from '../../app/api/payment/route';

jest.mock('../db', () => ({
  q: jest.fn().mockResolvedValue({ rows: [] }),
  one: jest.fn().mockResolvedValue(null),
}));
jest.mock('../task-from-lead', () => ({
  createTaskFromLead: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../przelewy24', () => ({
  isP24Configured: () => false,
  registerTransaction: jest.fn(),
  toP24Language: () => 'pl',
}));
jest.mock('../payu', () => ({
  isPayUConfigured: () => false,
  createPayUOrder: jest.fn(),
}));
jest.mock('../stripe', () => ({ stripe: null }));

let ipCounter = 0;
function req(body: unknown, ip?: string) {
  const clientAddr = ip ?? `10.0.0.${++ipCounter}`;
  return {
    json: async () => body,
    headers: { get: (k: string) => (k.toLowerCase() === 'x-forwarded-for' ? clientAddr : null) },
  } as any;
}

const validBody = {
  amount: 25000,
  description: 'Testowa usługa',
  email: 'client@example.com',
};

describe('POST /api/payment — input validation', () => {
  it('rejects missing required params', async () => {
    const res = await postPayment(req({ amount: 25000 }));
    expect(res.status).toBe(400);
  });

  it.each([
    ['NaN', 'abc'],
    ['negative', -100],
    ['zero', 0],
    ['fractional grosze', 100.5],
    ['below 1 zł', 50],
    ['absurdly large', 100_000_000],
  ])('rejects %s amount', async (_label, amount) => {
    const res = await postPayment(req({ ...validBody, amount }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it('rejects malformed email', async () => {
    const res = await postPayment(req({ ...validBody, email: 'not-an-email' }));
    expect(res.status).toBe(400);
  });

  it('rejects oversized description', async () => {
    const res = await postPayment(req({ ...validBody, description: 'x'.repeat(301) }));
    expect(res.status).toBe(400);
  });

  it('accepts a valid catalog amount (falls through to mock provider in dev/test)', async () => {
    const res = await postPayment(req(validBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.redirectUrl).toContain('/payment/mock/');
  });

  it('rate-limits repeated attempts from one IP', async () => {
    const ip = '203.0.113.77';
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const res = await postPayment(req(validBody, ip));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
