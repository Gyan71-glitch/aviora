import { NextResponse } from "next/server";
import { mockTrains } from "@/lib/mock-data/trains";

export async function GET() {
  return NextResponse.json({ success: true, total: mockTrains.length, trains: mockTrains });
}
