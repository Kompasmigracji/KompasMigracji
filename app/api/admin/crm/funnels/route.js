import { NextResponse } from 'next/server';

export async function GET() {
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
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
