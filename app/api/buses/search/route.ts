import { NextResponse } from "next/server";
import { mockBuses } from "@/lib/mock-data/buses";

export async function GET() {
  return NextResponse.json({ success: true, total: mockBuses.length, buses: mockBuses });
}
