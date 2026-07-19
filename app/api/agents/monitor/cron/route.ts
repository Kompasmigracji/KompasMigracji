export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { runMonitorCycle } from '@/lib/monitor';

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return authHeader === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

// GET /api/agents/monitor/cron – Vercel cron triggers this endpoint
export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await runMonitorCycle();
    return NextResponse.json({ message: 'Monitor cycle executed' }, { status: 200 });
  } catch (e) {
    console.error('Monitor cron error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
