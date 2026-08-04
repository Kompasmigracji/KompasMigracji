export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { runMonitorCycle } from '@/lib/monitor';
import { requireAuth } from '@/lib/auth';

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret) return authHeader === `Bearer ${secret}`;
  return req.headers.get("x-vercel-cron") === "1";
}

// GET /api/agents/monitor/cron – Vercel cron triggers this endpoint.
// Not currently scheduled in vercel.json (the project is on the Hobby plan,
// which has a low cron-count limit that has broken deployment before — see
// commit history). Kept in place so it can be scheduled later without code
// changes once that's confirmed safe.
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

// POST /api/agents/monitor/cron – manual trigger for an authenticated admin,
// so the health check is reachable from /admin/agents without needing a
// scheduled cron.
export async function POST() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await runMonitorCycle();
    return NextResponse.json({ message: 'Monitor cycle executed' }, { status: 200 });
  } catch (e) {
    console.error('Monitor cron error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
