export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/agents';
import { getSupabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

// GET /api/agents/primus/status
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status || 403 });
  }
  const agents = await getAllAgents();
  return NextResponse.json({ agents }, { status: 200 });
}
