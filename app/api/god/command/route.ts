import { NextResponse } from 'next/server';
import { evaluateAndCommandGod } from '@/lib/god';
import { getSupabase } from '@/lib/supabase'; // helper to get supabase client with auth

export async function POST(request: Request) {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  // Only the Grand Architect (email) can call this endpoint
  if (!session || session.user.email !== 'iphoenixgsm@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { command, payload } = body;
  if (!command) {
    return NextResponse.json({ error: 'Missing command' }, { status: 400 });
  }

  const success = await evaluateAndCommandGod({ command, payload });
  if (!success) {
    return NextResponse.json({ error: 'Failed to dispatch command' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Command dispatched', command }, { status: 200 });
}
