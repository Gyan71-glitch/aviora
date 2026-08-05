"use client";

import { Ticket, ShieldCheck, Zap, ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";

const OFFERS = [
  {
    id: "MEALFLIGHTAIX",
    code: "MEALFLIGHTAIX",
    title: "Free In-Flight Meal",
    desc: "Use MEALFLIGHTAIX to get up to 20% off on meals & extra baggage.",
    icon: Ticket,
    bg: "from-blue-50 to-indigo-50 border-blue-200 text-blue-900",
    badgeBg: "bg-blue-600 text-white",
  },
  {
    id: "MMTSECURE",
    code: "MMTSECURE",
    title: "100% Refund Protection",
    desc: "Get up to 15% OFF on your flight booking cancellation insurance.",
    icon: ShieldCheck,
    bg: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900",
    badgeBg: "bg-emerald-600 text-white",
  },
  {
    id: "MMTPROMO",
    code: "MMTPROMO",
    title: "Instant ₹2,500 Discount",
    desc: "Get up to Rs 2,500 instant discount using MMTPROMO coupon code.",
    icon: Zap,
    bg: "from-amber-50 to-yellow-50 border-amber-200 text-amber-900",
    badgeBg: "bg-amber-600 text-white",
  },
];

export default function FlightOffersCarousel() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full my-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {OFFERS.map((offer) => {
          const Icon = offer.icon;
          const isCopied = copiedCode === offer.code;

          return (
            <div
              key={offer.id}
              onClick={() => handleCopy(offer.code)}
              className={`bg-gradient-to-br ${offer.bg} border rounded-2xl p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0 border border-slate-200/60 mt-0.5">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-extrabold tracking-wide uppercase">
                      {offer.code}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 leading-snug line-clamp-2">
                    {offer.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform mt-1">
                {isCopied ? (
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
