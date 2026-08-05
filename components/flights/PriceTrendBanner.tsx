"use client";

import { TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface Props {
  origin: string;
  destination: string;
}

export default function PriceTrendBanner({ origin, destination }: Props) {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-3.5 my-2 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            High demand for {origin} → {destination}
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300 uppercase">
              Fares rising
            </span>
          </h4>
          <p className="text-[11px] text-slate-600 font-medium">
            Over 84% of seats are already booked for this route. Fares expected to rise by 15% in 24 hours.
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-800 shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Price hold active</span>
      </div>
    </div>
  );
}
