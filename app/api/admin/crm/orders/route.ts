import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, buyers(full_name, phone, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // Default values if not provided
    const newOrder = {
      order_number: body.order_number || `ORD-${Date.now().toString().slice(-6)}`,
      status: body.status || 'новый',
      amount: body.total_amount || body.amount || 0,
      buyer_id: body.buyer_id || null, // Could create buyer first if needed
      notes: body.notes || ''
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
