"use client";

import Image from "next/image";
import Link from "next/link";
import { Plane, Building2, Compass, Camera, Car, Calendar, Ticket, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { UserBookingItem } from "@/lib/mock-data/user-bookings";

interface BookingCardProps {
  booking: any;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const bookingType = booking.type || booking.serviceType || "flight";
  const bookingRef = booking.reference || booking.bookingRef || booking.id;
  const orderId = booking.orderId || booking.id;

  // Fallback image logic so empty src ("") is never passed to Next.js Image
  let displayImage = booking.image;
  if (!displayImage || displayImage.trim() === "") {
    if (bookingType === "flight") {
      displayImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80";
    } else if (bookingType === "hotel") {
      displayImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80";
    } else {
      displayImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80";
    }
  }

  // Format details string safely so objects are never rendered directly as React children
  let detailsText = "";
  if (typeof booking.details === "object" && booking.details !== null) {
    detailsText = Object.values(booking.details)
      .filter((val) => val && typeof val !== "object")
      .slice(0, 3)
      .join(" • ");
  } else if (booking.details) {
    detailsText = String(booking.details);
  }

  const getIcon = () => {
    switch (bookingType) {
      case "flight":
        return <Plane className="w-5 h-5 text-midnight-navy" />;
      case "hotel":
        return <Building2 className="w-5 h-5 text-gold-dark" />;
      case "holiday":
        return <Compass className="w-5 h-5 text-gold-dark" />;
      case "tour":
        return <Camera className="w-5 h-5 text-amber-800" />;
      case "transfer":
        return <Car className="w-5 h-5 text-midnight-navy" />;
      default:
        return <Ticket className="w-5 h-5 text-gold-dark" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 transition-all hover:shadow-lg hover:border-gold">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Section: Image & Specs */}
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
            <Image
              src={displayImage}
              alt={booking.title || "Booking"}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                {getIcon()}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
                {bookingType} • Ref: {bookingRef}
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-midnight-navy">{booking.title}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{booking.subtitle}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                {booking.travelDate}
              </span>
              {detailsText && <span className="text-slate-500 font-mono">{detailsText}</span>}
            </div>
          </div>
        </div>

        {/* Right Section: Price & Action */}
        <div className="flex flex-col items-start md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right mb-4">
            <span className="text-xs text-slate-400 font-medium">Total Paid</span>
            <div className="text-2xl font-bold font-display text-midnight-navy">
              ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center md:justify-end gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {booking.status === "confirmed" ? "Confirmed & Ticketed" : "Completed Trip"}
            </span>
          </div>

          <Link
            href={`/ticket/${orderId}`}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md w-full md:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View E-Voucher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
