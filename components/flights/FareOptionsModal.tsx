"use client";

import { Flight } from "@/app/flights/page";
import { X, Check, ArrowRight, ShieldCheck, HelpCircle, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface FareFeature {
  text: string;
  check?: boolean;
  dash?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
}

export default function FareOptionsModal({ isOpen, onClose, flight }: Props) {
  const [protection, setProtection] = useState(false);

  if (!isOpen || !flight) return null;

  // Generate Fare prices based on base price
  const basePrice = flight.price;
  const slashedPrice = Math.round(basePrice * 1.06);
  const fareOption1Price = basePrice + 1;
  const avioraSaverPrice = Math.round(basePrice * 1.02);
  const premiumFlexPrice = Math.round(basePrice * 1.08);

  const isLCC = ["6E", "SG", "QP", "IX", "I5", "G8"].includes(flight.airline.code);
  const isRefundable = flight.refundable;

  interface FareCard {
    id: string;
    name: string;
    price: number;
    slashed: number | null;
    badge: string;
    badgeColor: string;
    tagline?: string;
    baggage: FareFeature[];
    flexibility: FareFeature[];
    seatsMeals: FareFeature[];
    benefits: string | null;
    showLock: boolean;
  }

  const fareCards: FareCard[] = [
    {
      id: "special",
      name: "MTTPL Special",
      price: basePrice,
      slashed: slashedPrice,
      badge: "MTTPL SPECIAL",
      badgeColor: "bg-slate-900 text-amber-400 border-slate-950",
      baggage: [
        { text: "7 Kgs (1 Piece x 7 Kgs) Cabin Baggage", check: true },
        { text: isLCC ? "15 Kgs Check-in Baggage" : "20 Kgs Check-in Baggage", check: true }
      ],
      flexibility: isRefundable
        ? [
            { text: "Cancellation starts at ₹ 3,500 (up to 24h before)", dash: true },
            { text: "Date Change starts at ₹ 3,000 (up to 24h before)", dash: true }
          ]
        : [
            { text: "No refund on Cancellation", check: false },
            { text: "Date Change not allowed", check: false }
          ],
      seatsMeals: [
        { text: "Chargeable Seats", dash: true },
        { text: isLCC ? "No complimentary meal" : "Complimentary Hot Meal Included", check: !isLCC }
      ],
      benefits: "Trip Secure worth ₹ 229",
      showLock: false
    },
    {
      id: "option1",
      name: "Fare Option 1",
      price: fareOption1Price,
      slashed: null,
      badge: "FARE OPTION 1",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      baggage: [
        { text: "7 Kgs (1 Piece x 7 Kgs) Cabin Baggage", check: true },
        { text: isLCC ? "15 Kgs Check-in Baggage" : "20 Kgs Check-in Baggage", check: true }
      ],
      flexibility: isRefundable
        ? [
            { text: "Cancellation starts at ₹ 3,500 (up to 24h before)", dash: true },
            { text: "Date Change starts at ₹ 3,000 (up to 24h before)", dash: true }
          ]
        : [
            { text: "No refund on Cancellation", check: false },
            { text: "Date Change not allowed", check: false }
          ],
      seatsMeals: [
        { text: "Chargeable Seats", dash: true },
        { text: isLCC ? "No complimentary meal" : "Complimentary Hot Meal Included", check: !isLCC }
      ],
      benefits: null,
      showLock: true
    },
    {
      id: "saver",
      name: "Aviora Saver",
      price: avioraSaverPrice,
      slashed: null,
      badge: "AVIORASAVER",
      badgeColor: "bg-blue-600 text-white border-blue-600",
      tagline: "Get Flat ₹ 225 OFF using code MTTPLSUPER",
      baggage: [
        { text: "7 Kgs Cabin Baggage", check: true },
        { text: isLCC ? "15 Kgs Check-in Baggage" : "25 Kgs Check-in Baggage", check: true }
      ],
      flexibility: [
        { text: "Cancellation fee starts at ₹ 2,999 (up to 4h before departure)", dash: true },
        { text: "Date Change fee starts at ₹ 1,999 (up to 4h before departure)", dash: true }
      ],
      seatsMeals: [
        { text: "Chargeable Seats", dash: true },
        { text: isLCC ? "Meals information not available" : "Complimentary Hot Meal Included", check: !isLCC }
      ],
      benefits: null,
      showLock: true
    },
    {
      id: "flex",
      name: "Premium Flex",
      price: premiumFlexPrice,
      slashed: null,
      badge: "PREMIUM FLEX",
      badgeColor: "bg-emerald-600 text-white border-emerald-600",
      baggage: [
        { text: "7 Kgs Cabin Baggage", check: true },
        { text: isLCC ? "25 Kgs Check-in Baggage" : "30 Kgs Check-in Baggage", check: true }
      ],
      flexibility: [
        { text: "Free Cancellation (up to 24h before departure)", check: true },
        { text: "Free Date Change (up to 24h before departure)", check: true }
      ],
      seatsMeals: [
        { text: "Free Standard Seats Included", check: true },
        { text: "Complimentary Hot Meal Included", check: true }
      ],
      benefits: "Priority Check-in & Baggage handling",
      showLock: true
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white w-full max-w-6xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-100"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Flight Details and Fare Options available for you!
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Flight Route Details Header */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 relative rounded-lg border border-slate-200 bg-white flex items-center justify-center p-1">
                  <Image
                    src={flight.airline.logo}
                    alt={flight.airline.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 tracking-tight">
                    {flight.departure.airport.code} → {flight.arrival.airport.code}
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    {flight.airline.name} · {flight.departure.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm font-bold text-slate-700">
                <div>
                  <span className="text-slate-400 text-xs block font-semibold">DEPARTURE</span>
                  <span>{flight.departure.time}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 text-xs block font-semibold">ARRIVAL</span>
                  <span>{flight.arrival.time}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 text-xs block font-semibold">DURATION</span>
                  <span>{flight.duration}</span>
                </div>
              </div>
            </div>

            {/* Price Drop Protection Bar */}
            <div 
              onClick={() => setProtection(!protection)}
              className="border border-blue-100 bg-blue-50/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-50/40 transition-colors"
            >
              <input
                type="checkbox"
                checked={protection}
                onChange={() => {}}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-left text-xs font-semibold">
                <span className="text-slate-900 font-bold block md:inline">Add Price Drop Protection</span>
                <span className="text-slate-500 md:ml-2">See a fare drop? We refund the difference. Protect your booking today!</span>
              </div>
            </div>

            {/* Fare Options Scrolling Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {fareCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white border border-slate-200/80 rounded-2xl flex flex-col overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left min-w-[240px]"
                >
                  {/* Card Title & Tag Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[46px]">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{card.name}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 bg-slate-50/40 border-b border-slate-100/50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">
                        ₹{(card.price + (protection ? 229 : 0)).toLocaleString("en-IN")}
                      </span>
                      {card.slashed && (
                        <span className="text-xs font-bold text-slate-400 line-through">
                          ₹{card.slashed.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">per adult</span>
                    {card.tagline && (
                      <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                        {card.tagline}
                      </div>
                    )}
                  </div>

                  {/* Details Lists */}
                  <div className="p-4 flex-1 space-y-4">
                    {/* Baggage */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">BAGGAGE</span>
                      {card.baggage.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-600 leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Flexibility */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">FLEXIBILITY</span>
                      {card.flexibility.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-600 leading-tight">
                          {f.check ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : f.dash ? (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700 text-[10px] font-bold">-</span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 text-rose-700 text-[9px] font-bold">✕</span>
                          )}
                          <span>{f.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Seats & Meals */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SEATS & MEALS</span>
                      {card.seatsMeals.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-600 leading-tight">
                          {s.check ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : s.dash ? (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700 text-[10px] font-bold">-</span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 text-rose-700 text-[9px] font-bold">✕</span>
                          )}
                          <span>{s.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Benefits Included */}
                    {card.benefits && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">BENEFITS INCLUDED</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{card.benefits}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buttons footer */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-2 shrink-0">
                    <Link
                      href={`/checkout/${flight.id}?fare=${card.id}&price=${card.price + (protection ? 229 : 0)}`}
                      className="w-full"
                    >
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm">
                        BOOK NOW
                      </button>
                    </Link>
                    {card.showLock && (
                      <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        LOCK PRICE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
