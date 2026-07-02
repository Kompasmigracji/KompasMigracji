import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "id": 1,
    "buyer": "John Doe",
    "total": 150,
    "status": "Completed"
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
