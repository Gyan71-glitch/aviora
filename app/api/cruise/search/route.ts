import { NextResponse } from "next/server";
import { mockCruises } from "@/lib/mock-data/cruises";

export async function GET() {
  return NextResponse.json({ success: true, total: mockCruises.length, cruises: mockCruises });
}
