import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const rows = await q(`
      SELECT 
        o.*,
        b.full_name,
        b.phone,
        b.email
      FROM orders o
      LEFT JOIN buyers b ON o.buyer_id = b.id
      ORDER BY o.created_at DESC
    `);
    
    // Map to the format Supabase JS used: { ..., buyers: { full_name, phone, email } }
    const mapped = rows.map((r: any) => {
      const { full_name, phone, email, ...orderData } = r;
      return {
        ...orderData,
        buyers: full_name || phone || email ? { full_name, phone, email } : null
      };
    });

    return NextResponse.json({ data: mapped });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    
    const newOrder = {
      order_number: body.order_number || `ORD-${Date.now().toString().slice(-6)}`,
      status: body.status || 'новый',
      total_price: body.total_amount || body.amount || 0,
      buyer_id: body.buyer_id || null,
    };

    const row = await one(
      `INSERT INTO orders (order_number, status, total_price, buyer_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [newOrder.order_number, newOrder.status, newOrder.total_price, newOrder.buyer_id]
    );

    return NextResponse.json({ ok: true, data: row });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
