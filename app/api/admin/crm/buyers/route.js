import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "Active"
  },
  {
    "id": 2,
    "name": "Alice Smith",
    "email": "alice@example.com",
    "phone": "+9876543210",
    "status": "Lead"
  }
] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
