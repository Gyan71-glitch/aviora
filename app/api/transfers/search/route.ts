import { NextResponse } from "next/server";
import { mockTransferOptions } from "@/lib/mock-data/transfers";

const SMT_DB_CONFIG = {
  server: "115.124.106.157",
  database: "SRI_Master",
  user: "travelpo",
  password: "tlh3a*0w$w9LLucM",
  port: 1433,
  options: { trustServerCertificate: true, encrypt: false },
  connectionTimeout: 10000,
  requestTimeout: 15000,
};

function normalizeSMTDBTransfer(tr: any, index: number) {
  const price = tr.SANetAmt || tr.Gross || 3500 + index * 500;
  return {
    id: `smt-trf-${tr.TransferReservationId || index}`,
    vehicleName: tr.TransferName && tr.TransferName.length < 60
      ? tr.TransferName
      : "SMT Private Chauffeur Cab",
    vehicleType: tr.TransferType?.toLowerCase().includes("suv")
      ? "suv"
      : tr.TransferType?.toLowerCase().includes("van")
      ? "minivan"
      : "sedan",
    image:
      tr.TransferImage && tr.TransferImage.startsWith("http")
        ? tr.TransferImage
        : index % 2 === 0
        ? "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
        : "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    capacityPassengers: tr.AdultCount ? tr.AdultCount + (tr.ChildCount || 0) : 4,
    baggageCount: 3,
    pickupLocation: tr.CityName ? `${tr.CityName} Airport` : "Airport Pickup",
    dropoffLocation: tr.CityName ? `${tr.CityName} City Center` : "Hotel Transfer",
    price: Math.round(price),
    pricePerTrip: Math.round(price),
    currency: "INR",
    vehicleClass: tr.TransferType || "Private Executive Transfer",
    featured: index < 2,
    features: [
      "AC Vehicle & Professional Chauffeur",
      "Flight Tracking & Free Waiting Time",
      "Door-to-Door Hotel Transfer",
      "Luggage Assistance Included",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours before pickup",
    provider: "SMT Cabs & Transfers",
    source: "smt_db",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "";

  let transfers: any[] = [];
  let source = "mock";

  try {
    const sql = (await import("mssql")).default;
    let pool: any;
    try {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    } catch {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    }

    const trfResult = await pool.request().query(`
      SELECT TOP 20
        TransferReservationId, TransferName, TransferType, TransferImage,
        CityName, CountryName, PickUpTime, Duration, AdultCount, ChildCount,
        SANetAmt, Gross, Status, VoucherNo
      FROM Transfer_Reservation
      ORDER BY TransferReservationId DESC
    `);

    if (trfResult.recordset.length > 0) {
      transfers = trfResult.recordset.map((tr: any, idx: number) =>
        normalizeSMTDBTransfer(tr, idx)
      );
      source = "smt_db";
    }

    await pool.close();
  } catch (err: any) {
    console.error("[TransfersSearch] SMT DB error:", err.message);
  }

  // Include standard transfer vehicle options if DB has fewer entries
  if (transfers.length === 0 || transfers.length < 4) {
    const mockMapped = mockTransferOptions.map((tr, idx) => ({
      ...tr,
      pricePerTrip: tr.price,
      provider: "SMT Transfers",
      source: "mock",
    }));

    if (type) {
      transfers = mockMapped.filter((tr) => tr.vehicleType.toLowerCase().includes(type.toLowerCase()));
    } else {
      transfers = [...transfers, ...mockMapped];
    }
  }

  return NextResponse.json({
    success: true,
    total: transfers.length,
    transfers,
    source,
  });
}
