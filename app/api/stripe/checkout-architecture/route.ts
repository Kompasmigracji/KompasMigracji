import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // In production, add this to .env
const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/* Server-side source of truth for the 3 fixed architecture packages, mirroring
   the packageId/price pairs in app/architecture/page.tsx. This route used to take
   packageName + price straight from the client request body and hand them to
   Stripe unchecked — anyone could open devtools and buy the $4,500 package for
   $0.50 by editing the request. Look the real price up here instead. */
const ARCHITECTURE_PACKAGES: Record<string, { name: string; price: number }> = {
  Starter: { name: 'Starter Concept', price: 1500 },
  Pro: { name: 'Pro Vision', price: 2500 },
  Premium: { name: 'Premium Revitalization', price: 4500 },
};

export async function POST(request: NextRequest) {
  const rl = rateLimit(clientIp(request), { ns: 'checkout-architecture', max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { packageId } = await request.json();
    const pkg = packageId ? ARCHITECTURE_PACKAGES[packageId] : undefined;

    if (!pkg) {
      return NextResponse.json({ error: 'Unknown package' }, { status: 400 });
    }
    const { name: packageName, price } = pkg;

    if (!STRIPE_SECRET_KEY) {
      // Mock mode if no Stripe key is present
      console.log(`[STRIPE MOCK] Creating checkout session for ${packageName} at $${price}`);
      return NextResponse.json({ url: `${DOMAIN}/payment/success?session_id=mock_${Date.now()}` });
    }

    // Call Stripe API manually or via stripe-node
    // For now, doing it via native fetch to avoid adding new npm dependencies
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': `iPhoenix Architecture: ${packageName}`,
        'line_items[0][price_data][unit_amount]': (price * 100).toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${DOMAIN}/architecture`,
        /* Without metadata, checkout.session.completed in the webhook has no way to
           tell an architecture-package purchase apart from any other Stripe session
           (session.metadata?.sessionId is undefined for these), so the purchase never
           got synced into the CRM — see app/api/stripe/webhook/route.ts's `type ===
           "architecture"` branch, which reads these fields back out. */
        'metadata[type]': 'architecture',
        'metadata[packageId]': packageId,
        'metadata[packageName]': packageName,
      }),
    });

    const session = await stripeResponse.json();

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
