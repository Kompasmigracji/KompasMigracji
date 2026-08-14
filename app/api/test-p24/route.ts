export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { diagnoseAccess } from "@/lib/przelewy24";

export async function GET() {
  const result = await diagnoseAccess();
  return NextResponse.json(result);
}
