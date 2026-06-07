import { NextResponse } from 'next/server';
import { dispatchTask } from '@/lib/agents';
import { getSupabase } from '@/lib/supabase';

// POST /api/agents/primus/dispatch
export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== 'iphoenixgsm@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
