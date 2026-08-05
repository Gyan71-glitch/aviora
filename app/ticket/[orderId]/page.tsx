import { Duffel } from "@duffel/api";
import Navbar from "@/components/layout/Navbar";
import { Plane, CheckCircle, Download, Clock, Briefcase, Camera, Car, Building2, Compass, ShieldCheck, MapPin, Calendar, User, Check, Home, Train, Bus, FileText, Anchor, CreditCard } from "lucide-react";
import Image from "next/image";
import { mockSightseeingTours } from "@/lib/mock-data/sightseeing";
import { mockTransferOptions } from "@/lib/mock-data/transfers";
import { mockHolidayPackages } from "@/lib/mock-data/holidays";
import { mockVillas } from "@/lib/mock-data/villas";
import { mockTrains } from "@/lib/mock-data/trains";
import { mockBuses } from "@/lib/mock-data/buses";
import { mockVisas } from "@/lib/mock-data/visa";
import { mockCruises } from "@/lib/mock-data/cruises";
import { mockForexCards } from "@/lib/mock-data/forex";
import { mockInsurancePlans } from "@/lib/mock-data/insurance";
import { mockHotels } from "@/lib/mock-data/hotels";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export default async function TicketPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  let bookingType: "flight" | "tour" | "transfer" | "hotel" | "package" | "villa" | "train" | "bus" | "visa" | "cruise" | "forex" | "insurance" = "flight";
  let itemData: any = null;

  if (orderId.includes("tour_")) {
    bookingType = "tour";
    const tourId = orderId.replace("ord_tour_", "");
    itemData = mockSightseeingTours.find((t) => t.id === tourId) || mockSightseeingTours[0];
  } else if (orderId.includes("transfer_")) {
    bookingType = "transfer";
    const trId = orderId.replace("ord_transfer_", "");
    itemData = mockTransferOptions.find((t) => t.id === trId) || mockTransferOptions[0];
  } else if (orderId.includes("pkg-") || orderId.includes("smt_pkg")) {
    bookingType = "package";
    const pkgId = orderId.replace("ord_smt_", "");
    itemData = mockHolidayPackages.find((p) => p.id === pkgId) || mockHolidayPackages[0];
  } else if (orderId.includes("villa_")) {
    bookingType = "villa";
    const vId = orderId.replace("ord_villa_", "");
    itemData = mockVillas.find((v) => v.id === vId) || mockVillas[0];
  } else if (orderId.includes("train_")) {
    bookingType = "train";
    itemData = mockTrains[0];
  } else if (orderId.includes("bus_")) {
    bookingType = "bus";
    const bId = orderId.replace("ord_bus_", "");
    itemData = mockBuses.find((b) => b.id === bId) || mockBuses[0];
  } else if (orderId.includes("visa_")) {
    bookingType = "visa";
    const vId = orderId.replace("ord_visa_", "");
    itemData = mockVisas.find((v) => v.id === vId) || mockVisas[0];
  } else if (orderId.includes("cruise_")) {
    bookingType = "cruise";
    const cId = orderId.replace("ord_cruise_", "");
    itemData = mockCruises.find((c) => c.id === cId) || mockCruises[0];
  } else if (orderId.includes("forex_")) {
    bookingType = "forex";
    const fId = orderId.replace("ord_forex_", "");
    itemData = mockForexCards.find((f) => f.id === fId) || mockForexCards[0];
  } else if (orderId.includes("ins_")) {
    bookingType = "insurance";
    const iId = orderId.replace("ord_ins_", "");
    itemData = mockInsurancePlans.find((i) => i.id === iId) || mockInsurancePlans[0];
  } else if (orderId.includes("hotel_")) {
    bookingType = "hotel";
    const parts = orderId.split("hotel_")[1] || "";
    const hotelId = parts.split("-")[0] || "ht-001";
    itemData = mockHotels.find((h) => h.id === hotelId) || mockHotels[0];
  }

  let order: any = null;
  if (bookingType === "flight" && process.env.DUFFEL_ACCESS_TOKEN && orderId && orderId !== "latest" && orderId.startsWith("ord_")) {
    try {
      const response = await duffel.orders.get(orderId);
      order = response.data;
    } catch (err) {
      console.warn("Duffel fetch failed, falling back to mock ticket:", err);
    }
  }

  // Fallback flight ticket data
  if (bookingType === "flight" && !order) {
    order = {
      id: orderId || "ord_mttpl_984210",
      booking_reference: "MTTPL9842X",
      passengers: [{ title: "mr", given_name: "Gyan", family_name: "Vaibhav" }],
      owner: { name: "Emirates Airline", iata_code: "EK", logo_symbol_url: "https://pics.avs.io/80/80/EK.png" },
      slices: [
        {
          segments: [
            {
              departing_at: "2026-10-15T08:30:00",
              arriving_at: "2026-10-15T11:45:00",
              operating_carrier: { iata_code: "EK", operating_carrier_flight_number: "507" },
              origin: { iata_code: "BOM", city_name: "Mumbai" },
              destination: { iata_code: "DXB", city_name: "Dubai" },
              passengers: [{ cabin_class: "first", baggages: [{ quantity: 2 }] }],
            },
          ],
        },
      ],
    };
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      <Navbar />
      <div className="pt-24 md:pt-32 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-midnight-navy tracking-tight">
            {bookingType === "tour" && "Tour Pass Confirmed!"}
            {bookingType === "transfer" && "Chauffeur Transfer Confirmed!"}
            {bookingType === "package" && "Holiday Package Confirmed!"}
            {bookingType === "hotel" && "Hotel Reservation Confirmed!"}
            {bookingType === "flight" && "Flight Booking Confirmed!"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Your official MTTPL e-voucher has been issued successfully.
          </p>
        </div>

        {/* Dynamic E-Voucher Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 relative">
          <div className="h-4 bg-gradient-to-r from-gold via-amber-500 to-gold-dark w-full" />

          <div className="p-8 md:p-10">
            {/* SIGHTSEEING TOUR TICKET */}
            {bookingType === "tour" && itemData && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-gold-dark">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                        Sightseeing Tour Pass
                      </span>
                      <h2 className="text-xl font-bold text-midnight-navy max-w-md">{itemData.title}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {itemData.city}, {itemData.country} • {itemData.durationHours} Hours Duration
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 text-center min-w-[160px]">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-1">
                      Voucher Code
                    </p>
                    <p className="text-3xl font-mono font-bold text-midnight-navy">MTTPL-TOUR-984</p>
                  </div>
                </div>

                {/* Tour Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Lead Guest</p>
                    <p className="font-bold text-midnight-navy">Gyan Vaibhav</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Pass Count</p>
                    <p className="font-mono font-bold text-midnight-navy">2 Adult Passes</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tour Date</p>
                    <p className="font-bold text-midnight-navy">16 Oct 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                    <p className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Instant VIP Entry
                    </p>
                  </div>
                </div>

                {/* Inclusions Box */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">
                    Included Tour Benefits & Meeting Point
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {itemData.inclusions.map((inc: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHAUFFEUR TRANSFER TICKET */}
            {bookingType === "transfer" && itemData && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-midnight-navy">
                      <Car className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                        VIP Chauffeur Pass
                      </span>
                      <h2 className="text-xl font-bold text-midnight-navy">{itemData.vehicleName}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">{itemData.vehicleClass}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 text-center min-w-[160px]">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-1">
                      Transfer Ref
                    </p>
                    <p className="text-3xl font-mono font-bold text-midnight-navy">MTTPL-RIDE-774</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Passenger Name</p>
                    <p className="font-bold text-midnight-navy">Gyan Vaibhav</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Capacity</p>
                    <p className="font-mono font-bold text-midnight-navy">
                      {itemData.capacityPassengers} Passengers / {itemData.baggageCount} Luggage
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Pickup Time</p>
                    <p className="font-bold text-midnight-navy">15 Oct 2026, 14:30</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Protection</p>
                    <p className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> 60-Min Delay Protection
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Pickup Point</p>
                    <p className="font-bold text-midnight-navy">{itemData.pickupLocation}</p>
                  </div>
                  <div className="text-gold-dark font-bold text-sm font-mono">➜</div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Dropoff Destination</p>
                    <p className="font-bold text-midnight-navy">{itemData.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* HOLIDAY PACKAGE TICKET */}
            {bookingType === "package" && itemData && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-gold-dark">
                      <Compass className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                        MTTPL Holiday Package
                      </span>
                      <h2 className="text-xl font-bold text-midnight-navy max-w-md">{itemData.title}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {itemData.destination}, {itemData.country} • {itemData.durationNights} Nights / {itemData.durationDays} Days
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 text-center min-w-[160px]">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-1">
                      Package Ref
                    </p>
                    <p className="text-3xl font-mono font-bold text-midnight-navy">MTTPL-PKG-552</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Lead Guest</p>
                    <p className="font-bold text-midnight-navy">Gyan Vaibhav</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Travelers</p>
                    <p className="font-mono font-bold text-midnight-navy">2 Guests</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Departure Date</p>
                    <p className="font-bold text-midnight-navy">15 Oct 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                    <p className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> All-Inclusive Confirmed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HOTEL TICKET */}
            {bookingType === "hotel" && itemData && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-gold-dark">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                        Luxury Resort Voucher
                      </span>
                      <h2 className="text-xl font-bold text-midnight-navy max-w-md">{itemData.name}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {itemData.city}, {itemData.country} • {itemData.stars} Star Property
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 text-center min-w-[180px]">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-1">
                      Confirmation PNR
                    </p>
                    <p className="text-2xl font-mono font-bold text-midnight-navy">MTTPL-HOTEL-{(orderId.split("-").pop() || "984").toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Lead Guest</p>
                    <p className="font-bold text-midnight-navy">John Doe</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Room Category</p>
                    <p className="font-bold text-midnight-navy">{itemData.rooms?.[0]?.roomType || "Luxury Suite"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Stay Duration</p>
                    <p className="font-bold text-midnight-navy">1 Night (2 Adults)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                    <p className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Instant Confirmed
                    </p>
                  </div>
                </div>

                {/* Hotel checkin policies */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">
                    Important Check-in Information
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-650 font-semibold list-disc list-inside">
                    <li>Check-in desk opens at {itemData.checkInTime || "14:00"}. Early check-in is subject to availability.</li>
                    <li>Official Check-out must be completed by {itemData.checkOutTime || "12:00"}.</li>
                    <li>Government-issued ID (Aadhaar / Passport) is strictly mandatory at check-in for all occupants.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* FLIGHT TICKET */}
            {bookingType === "flight" && order && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center relative overflow-hidden">
                      <Image
                        src={order.owner.logo_symbol_url || `https://pics.avs.io/80/80/${order.owner.iata_code || "EK"}.png`}
                        alt={order.owner.name || "Airline"}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-midnight-navy">{order.owner.name}</h2>
                      <p className="text-sm text-slate-500 font-medium">
                        Flight {order.slices[0].segments[0].operating_carrier.iata_code}{" "}
                        {order.slices[0].segments[0].operating_carrier.operating_carrier_flight_number || "507"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 text-center min-w-[160px]">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-1">
                      Booking Ref (PNR)
                    </p>
                    <p className="text-3xl font-mono font-bold text-midnight-navy">{order.booking_reference || "MTTPL9842X"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Passenger Name</p>
                    <p className="font-bold text-midnight-navy">
                      {(order.passengers[0].title || "MR").toUpperCase()} {order.passengers[0].given_name}{" "}
                      {order.passengers[0].family_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">E-Ticket Number</p>
                    <p className="font-mono font-bold text-midnight-navy">MTTPL-7849204812</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Class</p>
                    <p className="font-bold text-midnight-navy">
                      {(order.slices[0].segments[0].passengers[0]?.cabin_class || "First").replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Baggage</p>
                    <p className="font-bold text-midnight-navy flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" /> 2 Checked
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Footer / Perforated edge */}
          <div className="relative flex justify-between items-center bg-slate-100 p-8 border-t border-dashed border-slate-300">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#f8f9fa] rounded-full" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#f8f9fa] rounded-full" />

            <div className="flex-1 mr-8">
              <div className="h-12 w-full max-w-[300px] opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] repeat-x" />
              <p className="text-[10px] font-mono mt-2 text-slate-500 tracking-[0.2em]">{orderId}</p>
            </div>

            <button className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shrink-0 shadow-md">
              <Download className="w-4 h-4" />
              Download Voucher PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
