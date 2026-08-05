import { NextResponse } from "next/server";
import { mockVillas } from "@/lib/mock-data/villas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase() || "";

  let list = mockVillas.filter((v) => {
    if (city && !v.city.toLowerCase().includes(city) && !v.location.toLowerCase().includes(city)) {
      return false;
    }
    return true;
  });

  return NextResponse.json({ success: true, total: list.length, villas: list });
}
