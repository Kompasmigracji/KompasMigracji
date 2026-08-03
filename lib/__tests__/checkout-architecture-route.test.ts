/* Regression test for the fix in app/api/stripe/webhook/route.ts / checkout-architecture:
   this route used to create a raw Stripe Checkout Session with no `metadata`, so
   checkout.session.completed had no way to identify an architecture-package purchase
   (session.metadata?.sessionId was always undefined for these) and the purchase never
   synced into the CRM. It must now tag the session with metadata the webhook can read.

   The route reads STRIPE_SECRET_KEY into a module-level const at import time, so each
   test that needs the "real" (non-mock) branch resets the module registry and requires
   it fresh after setting the env var. */

let ipCounter = 0;
function req(body: unknown, ip?: string) {
  const clientAddr = ip ?? `10.1.0.${++ipCounter}`;
  return {
    json: async () => body,
    headers: { get: (k: string) => (k.toLowerCase() === 'x-forwarded-for' ? clientAddr : null) },
  } as any;
}

describe('POST /api/stripe/checkout-architecture', () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  afterEach(() => {
    process.env.STRIPE_SECRET_KEY = originalKey;
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('tags the Stripe session with architecture metadata so the webhook can identify it', async () => {
    jest.resetModules();
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ url: 'https://checkout.stripe.com/session/xyz' }),
    });
    global.fetch = fetchMock as any;

    // eslint-disable-next-line @typescript-eslint/no-require-imports -- needs a fresh require() after jest.resetModules() so the module-level STRIPE_SECRET_KEY const picks up the env var set above
    const { POST: postCheckoutArchitecture } = require('../../app/api/stripe/checkout-architecture/route');
    const res = await postCheckoutArchitecture(req({ packageId: 'Pro' }));
    expect(res.status).toBe(200);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0];
    const sentBody = new URLSearchParams(options.body as string);

    expect(sentBody.get('metadata[type]')).toBe('architecture');
    expect(sentBody.get('metadata[packageId]')).toBe('Pro');
    expect(sentBody.get('metadata[packageName]')).toBe('Pro Vision');
    // Price is looked up server-side from the fixed package catalog, not trusted from the client.
    expect(sentBody.get('line_items[0][price_data][unit_amount]')).toBe('250000');
  });

  it('rejects an unknown packageId', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- see note above
    const { POST: postCheckoutArchitecture } = require('../../app/api/stripe/checkout-architecture/route');
    const res = await postCheckoutArchitecture(req({ packageId: 'NotAPackage' }));
    expect(res.status).toBe(400);
  });
});
