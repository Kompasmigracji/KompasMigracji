import { NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/agents';
import { getSupabase } from '@/lib/supabase';

// GET /api/agents/primus/status
export async function GET() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== 'iphoenixgsm@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const agents = await getAllAgents();
  return NextResponse.json({ agents }, { status: 200 });
}
