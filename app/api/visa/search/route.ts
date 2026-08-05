import { NextResponse } from "next/server";
import { mockVisas } from "@/lib/mock-data/visa";

export async function GET() {
  return NextResponse.json({ success: true, total: mockVisas.length, visaOptions: mockVisas });
}
