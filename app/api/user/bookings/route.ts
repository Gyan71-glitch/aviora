import { NextResponse } from "next/server";
import { mockUserBookings } from "@/lib/mock-data/user-bookings";

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

export async function GET() {
  let bookings: any[] = [];
  let source = "mock";

  try {
    const sql = (await import("mssql")).default;
    let pool: any;
    try {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    } catch {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    }

    // 1. Fetch ALL Hotel Reservations from SMT Master DB
    const hotelRes = await pool.request().query(`
      SELECT
        HotelReservationId, ReservationId, HotelName, CityName, Address,
        Status, SANetAmt, BookingDate, ChkInDate, ChkOutDate, VoucherNo
      FROM Hotel_Reservation
      ORDER BY HotelReservationId DESC
    `);

    // 2. Fetch ALL Flight Bookings from SMT Master DB
    const flightRes = await pool.request().query(`
      SELECT
        BID, BookingRef, Origin, Destination, Status, AgGross, BookingDate, NoOfPassenger
      FROM BookingMaster
      ORDER BY BID DESC
    `);

    // 3. Fetch ALL Package Reservations from SMT Master DB
    const pkgRes = await pool.request().query(`
      SELECT
        PackageReservationId, PackageName, CityName, Status, SANetAmt, Booking_Date
      FROM Package_Reservation
      ORDER BY PackageReservationId DESC
    `);

    const smtHotelBookings = hotelRes.recordset.map((h: any) => ({
      id: `smt-htl-${h.HotelReservationId}`,
      bookingRef: h.VoucherNo || `SMT-HTL-${h.HotelReservationId}`,
      serviceType: "hotel",
      title: h.HotelName || "SMT Hotel Booking",
      subtitle: `${h.CityName || "Shimla"} • ${h.Status === "HK" ? "Confirmed" : "Cancelled"}`,
      status: h.Status === "HK" ? "confirmed" : "completed",
      bookingDate: h.BookingDate ? new Date(h.BookingDate).toISOString().split("T")[0] : "2024-08-13",
      travelDate: h.ChkInDate ? new Date(h.ChkInDate).toISOString().split("T")[0] : "2024-09-18",
      totalAmount: Math.round(h.SANetAmt || 150),
      currency: "INR",
      details: {
        hotelName: h.HotelName,
        city: h.CityName,
        checkIn: h.ChkInDate,
        checkOut: h.ChkOutDate,
        voucherNo: h.VoucherNo,
      },
      source: "smt_db",
    }));

    const smtFlightBookings = flightRes.recordset.map((f: any) => ({
      id: `smt-flt-${f.BID}`,
      bookingRef: f.BookingRef || `SMT-FLT-${f.BID}`,
      serviceType: "flight",
      title: `Flight: ${f.Origin || "DEL"} → ${f.Destination || "BOM"}`,
      subtitle: `${f.NoOfPassenger || 1} Passenger(s) • ${f.Status || "Confirmed"}`,
      status: f.Status === "HK" || f.Status === "Confirmed" ? "confirmed" : "completed",
      bookingDate: f.BookingDate ? new Date(f.BookingDate).toISOString().split("T")[0] : "2019-09-17",
      travelDate: f.BookingDate ? new Date(f.BookingDate).toISOString().split("T")[0] : "2019-09-20",
      totalAmount: Math.round(f.AgGross || 7860),
      currency: "INR",
      details: {
        origin: f.Origin,
        destination: f.Destination,
        passengers: f.NoOfPassenger,
      },
      source: "smt_db",
    }));

    const smtPackageBookings = pkgRes.recordset.map((p: any) => ({
      id: `smt-pkg-res-${p.PackageReservationId}`,
      bookingRef: `SMT-PKG-${p.PackageReservationId}`,
      serviceType: "holiday",
      title: p.PackageName || "SMT Holiday Package Booking",
      subtitle: `${p.CityName || "India"} • ${p.Status === "HK" ? "Confirmed" : "Cancelled"}`,
      status: p.Status === "HK" ? "confirmed" : "completed",
      bookingDate: p.Booking_Date ? new Date(p.Booking_Date).toISOString().split("T")[0] : "2024-05-06",
      travelDate: p.Booking_Date ? new Date(p.Booking_Date).toISOString().split("T")[0] : "2024-05-10",
      totalAmount: Math.round(p.SANetAmt || 4500),
      currency: "INR",
      details: {
        packageName: p.PackageName,
        city: p.CityName,
      },
      source: "smt_db",
    }));

    bookings = [...smtHotelBookings, ...smtFlightBookings, ...smtPackageBookings];
    if (bookings.length > 0) source = "smt_db";

    await pool.close();
  } catch (err: any) {
    console.error("[UserBookings] SMT DB error:", err.message);
  }

  if (bookings.length === 0) {
    bookings = mockUserBookings as any[];
    source = "mock";
  }

  const activeBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status !== "confirmed");
  const totalSpent = bookings.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  return NextResponse.json({
    success: true,
    activeBookings,
    completedBookings,
    totalBookingsCount: bookings.length,
    totalSpent,
    source,
  });
}
