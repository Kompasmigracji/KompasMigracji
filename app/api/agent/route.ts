// app/api/agent/route.ts
import { NextResponse } from 'next/server';
import { invokeAlexDigital, AgentRequest } from '@/lib/lifeos/alexDigital';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const agentReq: AgentRequest = {
      mode: body.mode || 'strategist',
      message: body.message || '',
      contextSignals: body.contextSignals || {}
    };

    const response = await invokeAlexDigital(agentReq);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
