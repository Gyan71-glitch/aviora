import { NextResponse } from "next/server";
import { smtGet, SMT_ENDPOINTS, logSmtResult } from "@/lib/smt-client";

const FALLBACK_CATEGORIES = [
  { id: "international", name: "International", icon: "🌍" },
  { id: "domestic", name: "Domestic India", icon: "🇮🇳" },
  { id: "honeymoon", name: "Honeymoon", icon: "💑" },
  { id: "adventure", name: "Adventure", icon: "🏔️" },
  { id: "beach", name: "Beach & Island", icon: "🏖️" },
  { id: "wildlife", name: "Wildlife & Safari", icon: "🦁" },
  { id: "pilgrimage", name: "Pilgrimage", icon: "🕌" },
  { id: "cruise", name: "Cruise", icon: "🛳️" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "group", name: "Group Tours", icon: "🚌" },
];

export async function GET() {
  const smtUrl = `${SMT_ENDPOINTS.PACKAGE}/api/category?CompanyCode=SMT&channel=B2C`;
  const { ok, data, error } = await smtGet(smtUrl, 8000);
  logSmtResult("HolidayCategories", ok, error);

  if (ok && data?.Data?.length > 0) {
    const categories = data.Data.map((cat: any) => ({
      id: cat.CategoryId || cat.Id || cat.Code || "",
      name: cat.CategoryName || cat.Name || "",
      icon: "🌍",
    }));
    return NextResponse.json({ categories, source: "smt_live" });
  }

  return NextResponse.json({ categories: FALLBACK_CATEGORIES, source: "static" });
}
