import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "id": 1,
    "name": "Pending Orders",
    "count": 12
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
