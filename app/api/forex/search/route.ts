import { NextResponse } from "next/server";
import { mockForexCards } from "@/lib/mock-data/forex";

export async function GET() {
  return NextResponse.json({ success: true, total: mockForexCards.length, forexCards: mockForexCards });
}
