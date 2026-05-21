import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured');
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

    const { data, error } = await supabaseAdmin.from('leads').update({ status }).eq('id', id);
    if (error) {
      console.error('Error updating lead status', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('POST /api/admin/status', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
