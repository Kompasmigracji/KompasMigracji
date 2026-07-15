import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  return NextResponse.json({ data: [
  {
    "id": 1,
    "stage": "New",
    "count": 5
  },
  {
    "id": 2,
    "stage": "In Progress",
    "count": 2
  }
] });
}
export async function POST(req) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
