import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "metric": "Total Revenue",
    "value": "$1000"
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
