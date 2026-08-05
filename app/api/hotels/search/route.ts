import { NextResponse } from "next/server";
import { mockHotels } from "@/lib/mock-data/hotels";

// SMT Extranet DB Config (SRI_Extranet at 115.124.106.157)
const SMT_DB_CONFIG = {
  server: "115.124.106.157",
  database: "SRI_Extranet",
  user: "travelpo",
  password: "tlh3a*0w$w9LLucM",
  port: 1433,
  options: { trustServerCertificate: true, encrypt: false },
  connectionTimeout: 10000,
  requestTimeout: 15000,
};

const EXTRANET_IMG_BASE = "https://extranet.sourcemytrip.com/Images/SMT/Short/";

/** Build a normalized hotel from SMT Extranet DB row */
function normalizeExtranetHotel(h: any, imgMap: Map<number, string[]>, rate: any, idx: number) {
  const images = imgMap.get(h.HotelId) ?? [];
  const imgUrl =
    images.length > 0
      ? `${EXTRANET_IMG_BASE}${images[0]}`
      : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`;

  const galleryImages = images
    .slice(0, 6)
    .map((p: string) => `${EXTRANET_IMG_BASE}${p}`);

  const pricePerNight = rate
    ? Math.round(rate.DoubleRate || rate.SingleRate || 5000)
    : 5000;

  return {
    id: `nego-${h.HotelId}`,
    name: h.HotelName,
    image: imgUrl,
    galleryImages,
    location: h.Address || "",
    address: h.Address || "",
    city: h.CityName || "India",
    country: h.CountryName || "India",
    rating: 4.2 + (h.HotelId % 10) * 0.05, // deterministic "rating" until reviews present
    reviewCount: 200 + (h.HotelId * 17) % 800,
    pricePerNight,
    currency: "INR",
    stars: parseInt(h.StarCategory || "4") || 4,
    amenities: ["Free WiFi", "Room Service", "Parking", "Restaurant"],
    tags: ["NEGO", "SMT"],
    featured: idx < 3,
    checkInTime: h.CheckInTime || "14:00",
    checkOutTime: h.CheckOutTime || "12:00",
    description:
      h.HotelDescription ||
      `${h.HotelName} is a handpicked property managed by SourceMyTrip in ${h.CityName}.`,
    rooms: rate
      ? [
          {
            type: "Standard Double Room",
            price: Math.round(rate.DoubleRate || pricePerNight),
            available: 10,
          },
          {
            type: "Single Room",
            price: Math.round(rate.SingleRate || pricePerNight * 0.85),
            available: 5,
          },
        ]
      : [],
    smtToken: null,
    smtProvider: "NEGO",
    source: "smt_nego",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawDest = (searchParams.get("destination") || "").trim();
  const primaryCity = (rawDest.split(",")[0] || "").toLowerCase().trim();
  const destination = primaryCity;
  const checkIn =
    searchParams.get("checkIn") ||
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const checkOut =
    searchParams.get("checkOut") ||
    new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0];
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 200000;
  const starRating = searchParams.getAll("stars").map(Number);
  const sortBy = searchParams.get("sortBy") || "popularity";

  // ── Try SMT Extranet DB ───────────────────────────────────────────────
  let hotels: any[] = [];
  let source = "mock";

  try {
    // Dynamic import to avoid edge runtime issues
    const sql = (await import("mssql")).default;

    // Reuse connection pool if already open
    let pool: any;
    try {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    } catch {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    }

    // Build city filter — exclude obvious test hotels
    const cityFilter = destination
      ? `AND (LOWER(h.CityName) LIKE '%${destination.replace(/'/g, "")}%' OR LOWER(h.HotelName) LIKE '%${destination.replace(/'/g, "")}%' OR LOWER(h.CountryName) LIKE '%${destination.replace(/'/g, "")}%')`
      : "";

    const testFilter = `AND h.HotelName NOT LIKE '%test%' AND h.HotelName NOT LIKE '%Test%' AND h.HotelName NOT LIKE '%TEST%' AND h.HotelName NOT LIKE 'testt%'`;

    // Fetch matching hotels
    const hotelResult = await pool.request().query(`
      SELECT DISTINCT TOP 100
        h.HotelId, h.HotelCode, h.HotelName, h.CityName, h.CountryName,
        h.Address, h.StarCategory, h.CheckInTime, h.CheckOutTime,
        h.Longitude, h.Latitude, h.Phone1, h.Email, h.HotelDescription,
        h.HotelLogo
      FROM MstHotel h
      WHERE h.Status = 1
        ${cityFilter}
        ${testFilter}
      ORDER BY h.HotelId
    `);

    const hotelIds = hotelResult.recordset.map((h: any) => h.HotelId);

    if (hotelIds.length > 0) {
      // Get room rates — try date-specific first, then fall back to any valid rate
      const rateResult = await pool.request().query(`
        SELECT r.HotelId, r.SingleRate, r.DoubleRate, r.TripleRate, r.ValidFrom, r.ValidTo
        FROM MstHotelRoomRate r
        WHERE r.Status = 1
          AND r.isFreeSales = 1
          AND r.HotelId IN (${hotelIds.join(",")})
          AND r.DoubleRate > 0
        ORDER BY r.HotelId, r.ValidTo DESC, r.DoubleRate ASC
      `);

      // Map: HotelId → cheapest rate row
      const rateMap = new Map<number, any>();
      for (const r of rateResult.recordset) {
        if (!rateMap.has(r.HotelId)) {
          rateMap.set(r.HotelId, r);
        }
      }

      // Get hotel images
      const imgResult = await pool.request().query(`
        SELECT HotelId, ImagePath
        FROM MstHotelImagesMaster
        WHERE HotelId IN (${hotelIds.join(",")})
          AND ImageType = 'Short'
        ORDER BY HotelId
      `);

      const imgMap = new Map<number, string[]>();
      for (const img of imgResult.recordset) {
        const existing = imgMap.get(img.HotelId) ?? [];
        existing.push(img.ImagePath);
        imgMap.set(img.HotelId, existing);
      }

      // Build hotel list
      hotels = hotelResult.recordset.map((h: any, idx: number) =>
        normalizeExtranetHotel(h, imgMap, rateMap.get(h.HotelId), idx)
      );

      source = "smt_nego";
    }

    await pool.close();
  } catch (err: any) {
    console.error("[HotelSearch] SMT DB error:", err.message);
    // Fall through to mock
  }

  // ── Fall back to mock if DB returned nothing ──────────────────────────
  if (hotels.length === 0) {
    const matchedMock = mockHotels.filter((hotel) => {
      if (
        destination &&
        !hotel.city.toLowerCase().includes(destination) &&
        !hotel.name.toLowerCase().includes(destination) &&
        !hotel.country.toLowerCase().includes(destination) &&
        !hotel.location.toLowerCase().includes(destination)
      ) {
        return false;
      }
      if (hotel.pricePerNight < minPrice || hotel.pricePerNight > maxPrice)
        return false;
      if (starRating.length > 0 && !starRating.includes(hotel.stars))
        return false;
      return true;
    });

    // If destination matches mock hotels, use them; otherwise return all mock hotels as featured stays
    hotels = matchedMock.length > 0 ? matchedMock : mockHotels;
    source = "mock";
  }

  // ── Apply star rating filter ─────────────────────────────────────────────
  if (starRating.length > 0) {
    hotels = hotels.filter((h) => starRating.includes(h.stars));
  }

  // ── Prioritize chosen budget range first, then higher price results ──────
  const budgetMatches = hotels
    .filter((h) => h.pricePerNight >= minPrice && h.pricePerNight <= maxPrice)
    .sort((a, b) => a.pricePerNight - b.pricePerNight);

  const higherPriceMatches = hotels
    .filter((h) => h.pricePerNight > maxPrice)
    .sort((a, b) => a.pricePerNight - b.pricePerNight);

  const lowerPriceMatches = hotels
    .filter((h) => h.pricePerNight < minPrice)
    .sort((a, b) => a.pricePerNight - b.pricePerNight);

  if (sortBy === "price_asc") {
    hotels = [...budgetMatches, ...higherPriceMatches, ...lowerPriceMatches];
  } else if (sortBy === "price_desc") {
    hotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === "rating") {
    hotels.sort((a, b) => b.rating - a.rating);
  } else {
    // Default popularity / budget-first sorting
    hotels = [...budgetMatches, ...higherPriceMatches, ...lowerPriceMatches];
  }

  return NextResponse.json({
    success: true,
    total: hotels.length,
    hotels,
    source,
  });
}
