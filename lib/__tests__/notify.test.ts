/**
 * Unit tests for lib/notify.ts
 */

import { sendEmail, sendSlackWebhook } from '../notify';

// Mock global fetch
const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.SENDGRID_API_KEY;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('sendEmail', () => {
  it('returns false when SENDGRID_API_KEY is not set', async () => {
    const result = await sendEmail('test@test.com', 'Test', '<p>Hi</p>');
    expect(result).toBe(false);
  });

  it('returns true when SendGrid responds with 202', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 202,
    }) as any;

    const result = await sendEmail('test@test.com', 'Test', '<p>Hi</p>');
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sendgrid.com/v3/mail/send',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer SG.test-key',
        }),
      })
    );
  });

  it('returns false when SendGrid responds with error', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue('Bad Request'),
    }) as any;

    const result = await sendEmail('test@test.com', 'Test', '<p>Hi</p>');
    expect(result).toBe(false);
  });
});

describe('sendSlackWebhook', () => {
  it('returns true on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as any;

    const result = await sendSlackWebhook('https://hooks.slack.com/test', { text: 'hello' });
    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')) as any;

    const result = await sendSlackWebhook('https://hooks.slack.com/test', { text: 'hello' });
    expect(result).toBe(false);
  });
});
