import { NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // In production, add this to .env
const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { packageId, packageName, price } = await request.json();

    if (!packageId || !price) {
      return NextResponse.json({ error: 'Missing package details' }, { status: 400 });
    }

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
