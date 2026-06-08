export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { runMonitorCycle } from '@/lib/monitor';

// GET /api/agents/monitor/cron – Vercel cron triggers this endpoint
export async function GET() {
  // No auth for cron (Vercel secret can be added later). For now, allow.
  try {
    await runMonitorCycle();
    return NextResponse.json({ message: 'Monitor cycle executed' }, { status: 200 });
  } catch (e) {
    console.error('Monitor cron error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
