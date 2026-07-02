import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "id": 1,
    "from": "+1234567890",
    "duration": "5m",
    "time": "11:00 AM"
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
