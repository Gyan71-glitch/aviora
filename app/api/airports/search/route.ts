import { NextResponse } from "next/server";

export interface AirportResult {
  code: string;
  city: string;
  country: string;
  airport: string;
  flagEmoji: string;
  popular?: boolean;
}

const POPULAR_AIRPORTS: AirportResult[] = [
  { code: "DEL", city: "New Delhi", country: "India", airport: "Indira Gandhi Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "BOM", city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "BLR", city: "Bengaluru", country: "India", airport: "Kempegowda Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", airport: "Dubai Intl", flagEmoji: "🇦🇪", popular: true },
  { code: "MAA", city: "Chennai", country: "India", airport: "Chennai Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "HYD", city: "Hyderabad", country: "India", airport: "Rajiv Gandhi Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "CCU", city: "Kolkata", country: "India", airport: "Netaji Subhash Chandra Bose Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "GOI", city: "Goa", country: "India", airport: "Dabolim / Mopa Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "LHR", city: "London", country: "United Kingdom", airport: "Heathrow Airport", flagEmoji: "🇬🇧", popular: true },
  { code: "SIN", city: "Singapore", country: "Singapore", airport: "Changi Airport", flagEmoji: "🇸🇬", popular: true },
  { code: "BKK", city: "Bangkok", country: "Thailand", airport: "Suvarnabhumi Airport", flagEmoji: "🇹🇭", popular: true },
  { code: "JFK", city: "New York", country: "United States", airport: "John F. Kennedy Intl", flagEmoji: "🇺🇸", popular: true },
  { code: "DPS", city: "Bali", country: "Indonesia", airport: "Ngurah Rai Intl", flagEmoji: "🇮🇩", popular: true },
  { code: "CDG", city: "Paris", country: "France", airport: "Charles de Gaulle", flagEmoji: "🇫🇷", popular: true },
  { code: "SFO", city: "San Francisco", country: "United States", airport: "San Francisco Intl", flagEmoji: "🇺🇸", popular: true },
  { code: "LAX", city: "Los Angeles", country: "United States", airport: "Los Angeles Intl", flagEmoji: "🇺🇸", popular: true },
  { code: "DOH", city: "Doha", country: "Qatar", airport: "Hamad Intl", flagEmoji: "🇶🇦", popular: true },
  { code: "AUH", city: "Abu Dhabi", country: "United Arab Emirates", airport: "Zayed Intl", flagEmoji: "🇦🇪", popular: true },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", airport: "Schiphol Airport", flagEmoji: "🇳🇱", popular: true },
  { code: "FRA", city: "Frankfurt", country: "Germany", airport: "Frankfurt Airport", flagEmoji: "🇩🇪", popular: true },
  { code: "HND", city: "Tokyo", country: "Japan", airport: "Haneda Airport", flagEmoji: "🇯🇵", popular: true },
  { code: "ICN", city: "Seoul", country: "South Korea", airport: "Incheon Intl", flagEmoji: "🇰🇷", popular: true },
  { code: "SYD", city: "Sydney", country: "Australia", airport: "Kingsford Smith Intl", flagEmoji: "🇦🇺", popular: true },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", airport: "Kuala Lumpur Intl", flagEmoji: "🇲🇾", popular: true },
  { code: "COK", city: "Kochi", country: "India", airport: "Cochin Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "AMD", city: "Ahmedabad", country: "India", airport: "Sardar Vallabhbhai Patel Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "PNQ", city: "Pune", country: "India", airport: "Pune Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "TRV", city: "Trivandrum", country: "India", airport: "Thiruvananthapuram Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "JAI", city: "Jaipur", country: "India", airport: "Jaipur Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "IXC", city: "Chandigarh", country: "India", airport: "Shaheed Bhagat Singh Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "LKO", city: "Lucknow", country: "India", airport: "Chaudhary Charan Singh Intl", flagEmoji: "🇮🇳", popular: true },
  { code: "SXR", city: "Srinagar", country: "India", airport: "Sheikh ul-Alam Intl", flagEmoji: "🇮🇳", popular: true },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  let results: AirportResult[] = [];
  const apiKey = process.env.API_NINJAS_KEY || "raYHYSDYlpt1BIAED1qAe1KAJEzzop8oJWr2sOQz";

  if (!q) {
    return NextResponse.json({ success: true, airports: POPULAR_AIRPORTS });
  }

  const queryUpper = q.toUpperCase();

  // 1. Try API Ninjas IATA lookup if query is 3 letters
  if (q.length === 3) {
    try {
      const apiRes = await fetch(`https://api.api-ninjas.com/v1/airports?iata=${encodeURIComponent(queryUpper)}`, {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 86400 },
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((item: any) => {
            if (item.iata) {
              results.push({
                code: item.iata,
                city: item.city || item.name || queryUpper,
                country: item.country_name || item.country || "International",
                airport: item.name || `${item.city} Airport`,
                flagEmoji: getFlagEmoji(item.country),
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn("[API Ninjas] Airport lookup fallback:", err);
    }
  }

  // 2. Filter local master list by IATA, city, airport name, or country
  const localMatches = POPULAR_AIRPORTS.filter(
    (a) =>
      a.code.toUpperCase().includes(queryUpper) ||
      a.city.toUpperCase().includes(queryUpper) ||
      a.airport.toUpperCase().includes(queryUpper) ||
      a.country.toUpperCase().includes(queryUpper)
  );

  // Combine and deduplicate by code
  const codeSet = new Set(results.map((r) => r.code));
  localMatches.forEach((a) => {
    if (!codeSet.has(a.code)) {
      results.push(a);
      codeSet.add(a.code);
    }
  });

  return NextResponse.json({ success: true, airports: results });
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "✈️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
