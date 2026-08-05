"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ShieldCheck, Check, Sparkles } from "lucide-react";
import { HolidayPackage } from "@/lib/types";

interface HolidayBookingCardProps {
  pkg: HolidayPackage;
}

export default function HolidayBookingCard({ pkg }: HolidayBookingCardProps) {
  const router = useRouter();
  const [guests, setGuests] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>("2026-10-15");

  const totalPrice = pkg.pricePerPerson * guests;

  const handleBookNow = () => {
    // Route to dummy e-ticket confirmation
    router.push(`/ticket/ord_smt_${pkg.id}`);
  };

  return (
    <div className="glass-dark p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24 bg-white/95">
      {/* Pricing Header */}
      <div>
        <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-gold-dark" />
          Best Price Guarantee
        </div>
        <div className="text-xs text-slate-500 font-medium">Starting from</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-display text-midnight-navy">
            ₹{pkg.pricePerPerson.toLocaleString()}
          </span>
          {pkg.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{pkg.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-slate-500 font-medium">/ person</span>
        </div>
      </div>

      {/* Selectors */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Select Departure Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Travelers (Guests)
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Traveler" : "Travelers"} (₹{(pkg.pricePerPerson * num).toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Total Calculation */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>
            ₹{pkg.pricePerPerson.toLocaleString()} × {guests} Guests
          </span>
          <span className="font-mono">₹{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>Taxes & GST (Included)</span>
          <span className="text-emerald-700 font-bold">₹0</span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-midnight-navy">
          <span className="text-sm">Total Package Price</span>
          <span className="text-xl font-display text-gold-dark font-mono">
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleBookNow}
        className="btn-gold w-full h-13 rounded-2xl font-bold text-sm shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
      >
        <span>Book Package Now</span>
      </button>

      {/* Inclusions summary */}
      <div className="space-y-2 pt-2">
        {pkg.inclusions.slice(0, 4).map((inc, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
            <span>{inc}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Instant Confirmation & 24/7 Concierge</span>
      </div>
    </div>
  );
}
