import { NextResponse } from "next/server";
import { smtGet, SMT_ENDPOINTS, logSmtResult } from "@/lib/smt-client";

const FALLBACK_LOCATIONS = [
  { code: "DXB", name: "Dubai City Center", type: "city", country: "UAE" },
  { code: "DXBA", name: "Dubai International Airport (DXB)", type: "airport", country: "UAE" },
  { code: "AUHC", name: "Abu Dhabi City Center", type: "city", country: "UAE" },
  { code: "AUHA", name: "Abu Dhabi International Airport (AUH)", type: "airport", country: "UAE" },
  { code: "SIN", name: "Singapore Changi Airport (SIN)", type: "airport", country: "Singapore" },
  { code: "SINC", name: "Singapore City Center", type: "city", country: "Singapore" },
  { code: "BKK", name: "Bangkok Suvarnabhumi Airport (BKK)", type: "airport", country: "Thailand" },
  { code: "BKKC", name: "Bangkok City Center", type: "city", country: "Thailand" },
  { code: "BOMC", name: "Mumbai City Center", type: "city", country: "India" },
  { code: "BOM", name: "Mumbai Airport (BOM)", type: "airport", country: "India" },
  { code: "DELC", name: "Delhi City Center", type: "city", country: "India" },
  { code: "DEL", name: "Delhi Airport (DEL)", type: "airport", country: "India" },
  { code: "MLE", name: "Maldives Malé International Airport (MLE)", type: "airport", country: "Maldives" },
  { code: "GOI", name: "Goa Panaji City", type: "city", country: "India" },
  { code: "GOAI", name: "Goa Airport (GOI)", type: "airport", country: "India" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ locations: [] });
  }

  // Try SMT transfer autocomplete
  const smtUrl = `${SMT_ENDPOINTS.UTILITY}/api/transferDestination?request=${encodeURIComponent(query)}&CompanyCode=SMT`;
  const { ok, data, error } = await smtGet(smtUrl, 8000);
  logSmtResult("TransferAutocomplete", ok, error);

  if (ok && data?.Data?.length > 0) {
    const locations = data.Data.map((item: any) => ({
      code: item.Code || item.Id || "",
      name: item.Name || item.DisplayName || "",
      type: item.Type || "location",
      country: item.CountryName || "",
    }));
    return NextResponse.json({ locations, source: "smt_live" });
  }

  // Fallback
  const q = query.toLowerCase();
  const locations = FALLBACK_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q)
  ).slice(0, 8);

  return NextResponse.json({ locations, source: "static" });
}
