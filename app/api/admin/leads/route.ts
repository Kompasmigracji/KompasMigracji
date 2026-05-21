import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured');
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching leads', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('GET /api/admin/leads', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
