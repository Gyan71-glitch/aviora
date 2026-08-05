import { NextResponse } from "next/server";
import { mockHotels } from "@/lib/mock-data/hotels";

// SMT Extranet DB Config
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
    rating: 4.2 + (h.HotelId % 10) * 0.05,
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
    rooms: [
      {
        roomId: `rm-${h.HotelId}-1`,
        roomType: "Luxury Deluxe Room",
        boardBasis: "Breakfast Included",
        pricePerNight,
        totalPrice: pricePerNight,
        currency: "INR",
        maxOccupancy: 2,
        cancellationPolicy: "Free cancellation until 24 hours before check-in",
        available: true,
      }
    ],
    smtToken: null,
    smtProvider: "NEGO",
    source: "smt_nego",
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. If it's a mock hotel
  const mockMatch = mockHotels.find((h) => h.id === id);
  if (mockMatch) {
    return NextResponse.json({
      success: true,
      hotel: mockMatch,
    });
  }

  // 2. If it's an extranet db hotel (starts with "nego-")
  if (id.startsWith("nego-")) {
    const rawId = id.replace("nego-", "");
    const hotelId = parseInt(rawId);

    if (!isNaN(hotelId)) {
      try {
        const sql = (await import("mssql")).default;
        
        let pool: any;
        try {
          pool = await sql.connect(SMT_DB_CONFIG as any);
        } catch {
          pool = await sql.connect(SMT_DB_CONFIG as any);
        }

        // Fetch property info
        const hotelQuery = await pool.request().query(`
          SELECT TOP 1
            h.HotelId, h.HotelCode, h.HotelName, h.CityName, h.CountryName,
            h.Address, h.StarCategory, h.CheckInTime, h.CheckOutTime,
            h.Longitude, h.Latitude, h.Phone1, h.Email, h.HotelDescription,
            h.HotelLogo
          FROM MstHotel h
          WHERE h.HotelId = ${hotelId}
        `);

        const h = hotelQuery.recordset[0];

        if (h) {
          // Fetch property rate
          const rateQuery = await pool.request().query(`
            SELECT TOP 1 r.HotelId, r.SingleRate, r.DoubleRate, r.TripleRate
            FROM MstHotelRoomRate r
            WHERE r.Status = 1
              AND r.isFreeSales = 1
              AND r.HotelId = ${hotelId}
              AND r.DoubleRate > 0
            ORDER BY r.ValidTo DESC, r.DoubleRate ASC
          `);
          const rate = rateQuery.recordset[0];

          // Fetch photos
          const imgQuery = await pool.request().query(`
            SELECT HotelId, ImagePath
            FROM MstHotelImagesMaster
            WHERE HotelId = ${hotelId}
              AND ImageType = 'Short'
          `);
          const images = imgQuery.recordset.map((img: any) => img.ImagePath);

          const imgMap = new Map<number, string[]>();
          imgMap.set(hotelId, images);

          const hotelObj = normalizeExtranetHotel(h, imgMap, rate, 0);

          await pool.close();

          return NextResponse.json({
            success: true,
            hotel: hotelObj,
          });
        }
      } catch (err: any) {
        console.error(`[HotelDetailAPI] SMT DB error for hotel ID ${hotelId}:`, err.message);
      }
    }
  }

  // 3. Fallback: Not found
  return NextResponse.json(
    { success: false, error: "Property could not be retrieved" },
    { status: 404 }
  );
}
