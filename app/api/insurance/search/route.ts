import { NextResponse } from "next/server";
import { mockInsurancePlans } from "@/lib/mock-data/insurance";

export async function GET() {
  return NextResponse.json({ success: true, total: mockInsurancePlans.length, insurancePlans: mockInsurancePlans });
}
