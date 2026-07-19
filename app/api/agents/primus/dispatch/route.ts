export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { dispatchTask } from '@/lib/agents';
import { getSupabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

// POST /api/agents/primus/dispatch
export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status || 403 });
  }

  const { agentId, type, payload } = await request.json();
  if (!agentId || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const task = await dispatchTask(agentId, type, payload || {});
  if (!task) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Task queued', taskId: task.id }, { status: 200 });
}
