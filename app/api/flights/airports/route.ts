import { NextResponse } from "next/server";
import { smtGet, SMT_ENDPOINTS, logSmtResult } from "@/lib/smt-client";

const FALLBACK_AIRPORTS = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "GOI", name: "Goa International Airport", city: "Goa", country: "India" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "UAE" },
  { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "China" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
  { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
  { code: "FCO", name: "Leonardo da Vinci International Airport", city: "Rome", country: "Italy" },
  { code: "BCN", name: "El Prat Airport", city: "Barcelona", country: "Spain" },
  { code: "MLE", name: "Velana International Airport", city: "Malé", country: "Maldives" },
  { code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [] });
  }

  // Try SMT utility API for live airport/city list
  const smtUrl = `${SMT_ENDPOINTS.UTILITY}/api/Flight/GetAiportCityList?request=${encodeURIComponent(query)}&CompanyCode=SMT`;
  const { ok, data, error } = await smtGet(smtUrl, 8000);
  logSmtResult("AirportAutocomplete", ok, error);

  if (ok && data?.Data?.length > 0) {
    const airports = data.Data.map((item: any) => ({
      code: item.AirportCode || item.Code || "",
      name: item.AirportName || item.Name || "",
      city: item.CityName || item.City || "",
      country: item.CountryName || item.Country || "",
    }));
    return NextResponse.json({ airports, source: "smt_live" });
  }

  // Fallback: filter static list
  const q = query.toLowerCase();
  const airports = FALLBACK_AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);

  return NextResponse.json({ airports, source: "static" });
}
