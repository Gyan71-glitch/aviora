import { NextResponse } from "next/server";
import { smtGet, SMT_ENDPOINTS, logSmtResult } from "@/lib/smt-client";

// Static fallback city list for hotel autocomplete
const FALLBACK_CITIES = [
  { code: "DXB", name: "Dubai", country: "UAE", countryCode: "AE" },
  { code: "BOM", name: "Mumbai", country: "India", countryCode: "IN" },
  { code: "DEL", name: "Delhi", country: "India", countryCode: "IN" },
  { code: "GOA", name: "Goa", country: "India", countryCode: "IN" },
  { code: "SIN", name: "Singapore", country: "Singapore", countryCode: "SG" },
  { code: "BKK", name: "Bangkok", country: "Thailand", countryCode: "TH" },
  { code: "LHR", name: "London", country: "UK", countryCode: "GB" },
  { code: "CDG", name: "Paris", country: "France", countryCode: "FR" },
  { code: "JFK", name: "New York", country: "USA", countryCode: "US" },
  { code: "SYD", name: "Sydney", country: "Australia", countryCode: "AU" },
  { code: "MLE", name: "Maldives", country: "Maldives", countryCode: "MV" },
  { code: "BLR", name: "Bangalore", country: "India", countryCode: "IN" },
  { code: "HYD", name: "Hyderabad", country: "India", countryCode: "IN" },
  { code: "MAA", name: "Chennai", country: "India", countryCode: "IN" },
  { code: "CCU", name: "Kolkata", country: "India", countryCode: "IN" },
  { code: "AUH", name: "Abu Dhabi", country: "UAE", countryCode: "AE" },
  { code: "KUL", name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY" },
  { code: "HKG", name: "Hong Kong", country: "China", countryCode: "HK" },
  { code: "NRT", name: "Tokyo", country: "Japan", countryCode: "JP" },
  { code: "FCO", name: "Rome", country: "Italy", countryCode: "IT" },
  { code: "BCN", name: "Barcelona", country: "Spain", countryCode: "ES" },
  { code: "AMS", name: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { code: "JNB", name: "Johannesburg", country: "South Africa", countryCode: "ZA" },
  { code: "CMB", name: "Colombo", country: "Sri Lanka", countryCode: "LK" },
  { code: "DAC", name: "Dhaka", country: "Bangladesh", countryCode: "BD" },
  { code: "KTM", name: "Kathmandu", country: "Nepal", countryCode: "NP" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Try SMT Utility API for live city search
  const smtUrl = `${SMT_ENDPOINTS.UTILITY}/api/HTLDestination?request=${encodeURIComponent(query)}|SMT|en|false`;
  const { ok, data, error } = await smtGet(smtUrl, 8000);
  logSmtResult("HotelAutocomplete", ok, error);

  if (ok && data?.Data?.length > 0) {
    const suggestions = data.Data.map((item: any) => ({
      code: item.CityCode || item.Code || "",
      name: item.CityName || item.Name || item.DisplayName || "",
      country: item.CountryName || "",
      countryCode: item.CountryCode || "",
      type: item.Type || "city",
    }));
    return NextResponse.json({ suggestions, source: "smt_live" });
  }

  // Fallback: filter static list
  const q = query.toLowerCase();
  const suggestions = FALLBACK_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.country.toLowerCase().includes(q) ||
      city.code.toLowerCase().includes(q)
  ).slice(0, 8);

  return NextResponse.json({ suggestions, source: "static" });
}
