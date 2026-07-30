"use client";

import { Flight } from "@/app/flights/page";
import { Heart, Share, RefreshCw, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FlightCard({ flight }: { flight: Flight }) {
  const [imgError, setImgError] = useState(false);

  const stopLabel =
    flight.stops === 0
      ? "Non-stop"
      : flight.stops === 1
      ? "1 stop"
      : `${flight.stops} stops`;

  const depDate = flight.departure.date
    ? new Date(flight.departure.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden mb-3 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 group cursor-pointer shadow-sm">
      <div className="p-5 md:p-7 flex flex-col md:flex-row gap-6 relative">

        {/* Bookmark / Share */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-midnight-navy hover:bg-gray-50 transition-colors">
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-midnight-navy hover:bg-gray-50 transition-colors">
            <Share className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Flight Info */}
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6">

          {/* Airline Logo + Name */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 w-16">
            <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex items-center justify-center">
              {!imgError ? (
                <Image
                  src={flight.airline.logo}
                  alt={flight.airline.name}
                  width={48}
                  height={48}
                  className="object-contain p-1"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-xs font-bold text-gold">{flight.airline.code}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-semibold text-center leading-tight">
              {flight.airline.code}
            </span>
          </div>

          {/* Departure */}
          <div className="flex flex-col min-w-[90px]">
            <span className="text-2xl font-bold text-midnight-navy tracking-tight">
              {flight.departure.time}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {flight.departure.airport.code}
            </span>
            <span className="text-xs text-gray-400 truncate max-w-[110px]">
              {flight.departure.airport.city || flight.departure.airport.name}
            </span>
            {depDate && (
              <span className="text-[10px] text-gray-400 mt-0.5">{depDate}</span>
            )}
          </div>

          {/* Duration + Stops (center) */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
            <span className="text-xs text-gray-400 font-medium">{flight.duration}</span>
            <div className="flex items-center gap-1 w-full max-w-[140px]">
              <div className="flex-1 h-px bg-gray-200" />
              {flight.stops > 0 ? (
                Array.from({ length: flight.stops }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                ))
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              )}
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <span
              className={`text-[11px] font-semibold ${
                flight.stops === 0 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {stopLabel}
            </span>
            {flight.stopCities?.length > 0 && (
              <span className="text-[10px] text-gray-400">
                via {flight.stopCities.join(", ")}
              </span>
            )}
          </div>

          {/* Arrival */}
          <div className="flex flex-col min-w-[90px] text-right md:text-left">
            <span className="text-2xl font-bold text-midnight-navy tracking-tight">
              {flight.arrival.time}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {flight.arrival.airport.code}
            </span>
            <span className="text-xs text-gray-400 truncate max-w-[110px]">
              {flight.arrival.airport.city || flight.arrival.airport.name}
            </span>
          </div>

          {/* Airline name (hidden on mobile) */}
          <div className="hidden lg:flex flex-col min-w-[120px]">
            <span className="text-sm text-gray-500">{flight.airline.name}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-row md:flex-col justify-between md:justify-center items-end md:items-end md:w-44 shrink-0 md:border-l border-gray-100 md:pl-7 pt-4 md:pt-0 border-t md:border-t-0 group-hover:border-gold/20 transition-colors">
          <div>
            <div className="text-2xl font-bold text-midnight-navy group-hover:text-gold-dark transition-colors">
              ₹{flight.price.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-gray-400 mb-1">per person</div>
            <div className="flex items-center gap-1">
              {flight.refundable ? (
                <span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                  <CheckCircle className="w-3 h-3" /> Refundable
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <RefreshCw className="w-3 h-3" /> Non-refundable
                </span>
              )}
            </div>
          </div>
          <Link href={`/checkout/${flight.id}`} className="w-full">
            <button className="btn-gold py-2.5 px-6 rounded-xl font-bold shadow-md shadow-gold/15 group-hover:shadow-gold/40 group-hover:scale-105 transition-all duration-300 text-sm mt-3 md:mt-4 w-full">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
