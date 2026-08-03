import { POST as postFbWebhook } from '../../app/api/bot/fb-webhook/route';
import { findOrCreateChat, appendMessage } from '../crm-chats';
import { one } from '../db';

/* Regression test for the fix making Facebook Messenger part of the unified CRM
   chats inbox (app/admin/crm/chats): the webhook used to only write to
   kompas_leads directly, so inbound Messenger messages never showed up in — or
   could be replied to from — that inbox, unlike Telegram/WhatsApp/Viber. */

jest.mock('../crm-chats', () => ({
  findOrCreateChat: jest.fn().mockResolvedValue('chat-1'),
  appendMessage: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../db', () => ({
  q: jest.fn().mockResolvedValue({ rows: [] }),
  one: jest.fn().mockResolvedValue(null),
}));

jest.mock('../task-from-lead', () => ({
  createTaskFromLead: jest.fn().mockResolvedValue(undefined),
}));

function req(body: unknown, ip = '10.2.0.1') {
  return {
    text: async () => JSON.stringify(body),
    headers: { get: (k: string) => (k.toLowerCase() === 'x-forwarded-for' ? ip : null) },
  } as any;
}

const messengerPayload = {
  object: 'page',
  entry: [
    {
      messaging: [
        { sender: { id: 'psid_12345' }, message: { text: 'Hello, I need help' } },
      ],
    },
  ],
};

describe('POST /api/bot/fb-webhook', () => {
  const originalSecret = process.env.FB_APP_SECRET;

  beforeEach(() => {
    delete process.env.FB_APP_SECRET; // unset -> signature check skipped, matches other tests' focus
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.FB_APP_SECRET = originalSecret;
  });

  it('mirrors inbound messages into the unified CRM chats inbox', async () => {
    const res = await postFbWebhook(req(messengerPayload));
    expect(res.status).toBe(200);

    expect(findOrCreateChat).toHaveBeenCalledWith('facebook', 'psid_12345', expect.any(String));
    expect(appendMessage).toHaveBeenCalledWith('chat-1', 'Hello, I need help', 'client');
  });

  it('still writes the message into kompas_leads (existing behavior preserved)', async () => {
    (one as jest.Mock)
      .mockResolvedValueOnce(null) // existing-lead lookup: none found
      .mockResolvedValueOnce({ id: 'lead-1' }); // INSERT ... RETURNING id
    const res = await postFbWebhook(req(messengerPayload));
    expect(res.status).toBe(200);

    expect(one as jest.Mock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO kompas_leads'),
      expect.arrayContaining(['psid_12345']),
    );
  });
});
