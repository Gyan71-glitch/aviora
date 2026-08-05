"use client";

import { Flight } from "@/app/flights/page";
import {
  Heart,
  Share,
  RefreshCw,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Luggage,
  Utensils,
  Lock,
  Plane,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function FlightCard({ flight, onBookNow }: { flight: Flight; onBookNow?: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "farerules" | "baggage">("itinerary");
  const [isLocked, setIsLocked] = useState(false);

  const isMultiSlice = flight.allSlices && flight.allSlices.length > 1;
  const lockPriceFee = Math.round(flight.price * 0.035); // ~3.5% price hold fee (e.g. ₹262)

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 20px 30px -10px rgba(212, 175, 55, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden mb-3.5 hover:border-amber-400/60 group shadow-2xs"
    >
      {/* Top Main Flight Card Content */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 relative">
        {/* Bookmark & Share Actions */}
        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-amber-800 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Save Flight"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-amber-800 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Share Flight"
          >
            <Share className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Airline Logo + Name */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 w-16 pt-1">
          <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
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
              <span className="text-xs font-extrabold text-amber-800">{flight.airline.code}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-bold text-center leading-tight">
            {flight.airline.code}
          </span>
        </div>

        {/* Main Flight Itinerary (Supports 1-Way, Return, and Multi-City) */}
        <div className="flex-1 space-y-4">
          {(isMultiSlice ? (flight.allSlices || []) : [flight]).map((slice: any, sIdx: number) => {
            const dep = slice.departure || flight.departure;
            const arr = slice.arrival || flight.arrival;
            const dur = slice.duration || flight.duration;
            const stops = slice.stops ?? flight.stops;

            const legTitle =
              flight.tripType === "return"
                ? sIdx === 0
                  ? "Outbound"
                  : "Return"
                : flight.tripType === "multi_city"
                ? `Leg ${sIdx + 1}`
                : "";

            return (
              <div key={sIdx} className="flex flex-col md:flex-row items-start md:items-center gap-4 py-1">
                {legTitle && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    {legTitle}
                  </span>
                )}

                {/* Departure */}
                <div className="flex flex-col min-w-[80px]">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {dep.time}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {dep.airport?.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[100px]">
                    {dep.airport?.city || dep.airport?.name}
                  </span>
                </div>

                {/* Duration + Stops bar */}
                <div className="flex-1 flex flex-col items-center gap-0.5 min-w-[100px]">
                  <span className="text-[11px] text-slate-400 font-bold">{dur}</span>
                  <div className="flex items-center gap-1 w-full max-w-[120px]">
                    <div className="flex-1 h-px bg-slate-200" />
                    {stops > 0 ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {stops === 0 ? "Non-stop" : `${stops} stop`}
                  </span>
                </div>

                {/* Arrival */}
                <div className="flex flex-col min-w-[80px]">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {arr.time}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {arr.airport?.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[100px]">
                    {arr.airport?.city || arr.airport?.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Perks & Included Benefits Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 transition-colors">
              <Luggage className="w-3 h-3 text-slate-500" /> 15 kg Check-in
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 transition-colors">
              🎒 7 kg Cabin
            </span>
            {flight.airline.code === "AI" && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                <Utensils className="w-3 h-3 text-emerald-600" /> Complimentary Meal
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Column with Animated Price */}
        <div className="flex flex-row md:flex-col justify-between md:justify-center items-end md:items-end md:w-48 shrink-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 group-hover:border-amber-200 transition-colors">
          <div className="text-right">
            <motion.div
              key={flight.price}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors"
            >
              ₹{flight.price.toLocaleString("en-IN")}
            </motion.div>
            <div className="text-[11px] font-medium text-slate-400 mb-1">total for all travellers</div>
            <div className="flex items-center justify-end gap-1">
              {flight.refundable ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-extrabold">
                  <CheckCircle className="w-3 h-3" /> Refundable
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                  <RefreshCw className="w-3 h-3" /> Non-refundable
                </span>
              )}
            </div>
          </div>

          <div className="w-full space-y-2 mt-3 md:mt-4">
            <Link href={`/checkout/${flight.id}`} className="w-full block">
              <button 
                className="btn-gold py-2.5 px-6 rounded-xl font-bold shadow-md shadow-amber-500/15 group-hover:shadow-amber-500/35 group-hover:scale-[1.02] transition-all duration-300 text-xs w-full active:scale-95"
              >
                Book Now
              </button>
            </Link>

            {/* Lock Price CTA */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLocked(!isLocked);
              }}
              className={`w-full text-[11px] font-bold py-1 px-2 rounded-lg border transition-all flex items-center justify-center gap-1 active:scale-95 ${
                isLocked
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-amber-50/60 hover:bg-amber-100/60 border-amber-200 text-amber-900"
              }`}
            >
              <Lock className="w-3 h-3 text-amber-700" />
              <span>{isLocked ? "Price Locked for 48h!" : `Lock price @ ₹${lockPriceFee.toLocaleString("en-IN")} →`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Collapsible Bar (More Flight Details) */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-2 flex items-center justify-between select-none">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
        >
          <span>{expanded ? "Hide flight details" : "More flight details"}</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          {flight.stops === 0 ? "Direct Flight" : `Via ${flight.stopCities?.join(", ") || "Layover"}`}
        </span>
      </div>

      {/* Smooth Accordion Details Drawer */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-slate-50 border-t border-slate-200"
          >
            <div className="p-4">
              {/* Drawer Tabs Header */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
                {[
                  { id: "itinerary", label: "Itinerary & Aircraft" },
                  { id: "farerules", label: "Fare Rules & Refund" },
                  { id: "baggage", label: "Baggage Policy" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Smooth Tab Transition */}
              <AnimatePresence mode="wait">
                {activeTab === "itinerary" && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Plane className="w-4 h-4 text-amber-600" />
                        {flight.airline.name} ({flight.airline.code})
                      </span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600">
                        Aircraft: Airbus A320neo
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-slate-400 text-[11px]">Departure Terminal</p>
                        <p className="font-bold text-slate-900">{flight.departure.airport.name} (Terminal 3)</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[11px]">Arrival Terminal</p>
                        <p className="font-bold text-slate-900">{flight.arrival.airport.name} (Terminal 2)</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "farerules" && (
                  <motion.div
                    key="farerules"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs"
                  >
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Cancellation Fee (Prior 24h)</span>
                        <span className="font-bold text-slate-900">₹3,000 per passenger</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Date Change Fee</span>
                        <span className="font-bold text-slate-900">₹2,500 + fare difference</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Refund Eligibility</span>
                        <span className={`font-bold ${flight.refundable ? "text-emerald-600" : "text-amber-800"}`}>
                          {flight.refundable ? "Eligible for Cash Refund" : "Non-refundable Ticket"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "baggage" && (
                  <motion.div
                    key="baggage"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-400 font-medium">Cabin Baggage</span>
                        <p className="font-extrabold text-slate-900 text-sm mt-0.5">7 kg (1 Piece)</p>
                        <p className="text-[11px] text-slate-500 mt-1">L + W + H not to exceed 115 cm</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-400 font-medium">Check-in Baggage</span>
                        <p className="font-extrabold text-slate-900 text-sm mt-0.5">15 kg (1 Piece)</p>
                        <p className="text-[11px] text-slate-500 mt-1">Extra baggage @ ₹500/kg</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
