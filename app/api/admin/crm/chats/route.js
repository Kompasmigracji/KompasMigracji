import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "id": 1,
    "user": "John Doe",
    "lastMessage": "Hello, I need help",
    "time": "10:00 AM"
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
