"use client";

import { useState } from "react";
import {
  MapPin, Calendar, Users, Search, ChevronDown,
  ArrowRightLeft, Loader2
} from "lucide-react";
import { SearchParams } from "@/app/flights/page";

const CABIN_OPTIONS = [
  { value: "1", label: "All Classes" },
  { value: "2", label: "Economy" },
  { value: "3", label: "Premium Economy" },
  { value: "4", label: "Business" },
  { value: "6", label: "First Class" },
];

const POPULAR_ROUTES = [
  { origin: "DEL", destination: "BOM", label: "Delhi → Mumbai" },
  { origin: "DEL", destination: "DXB", label: "Delhi → Dubai" },
  { origin: "BOM", destination: "LHR", label: "Mumbai → London" },
  { origin: "DEL", destination: "SIN", label: "Delhi → Singapore" },
];

interface Props {
  params: SearchParams;
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function FlightSearchTopBar({ params, onSearch, loading }: Props) {
  const [origin, setOrigin] = useState(params.origin);
  const [destination, setDestination] = useState(params.destination);
  const [date, setDate] = useState(params.date);
  const [adults, setAdults] = useState(params.adults);
  const [cabin, setCabin] = useState(params.cabin);
  const [showCabin, setShowCabin] = useState(false);

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const submit = () => {
    if (!origin || !destination || !date) return;
    onSearch({ origin: origin.toUpperCase(), destination: destination.toUpperCase(), date, adults, cabin });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-[60px] z-40 py-4 shadow-sm">
      <div className="container-aviora">
        {/* Quick route chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 hide-scrollbar">
          {POPULAR_ROUTES.map((r) => (
            <button
              key={r.label}
              onClick={() => { setOrigin(r.origin); setDestination(r.destination); }}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                origin === r.origin && destination === r.destination
                  ? "bg-gold text-midnight-navy border-gold"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gold/50 hover:text-gold-dark"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Main search row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">

          {/* Cabin type */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowCabin(!showCabin)}
              className="flex items-center gap-2 bg-gray-50 rounded-xl px-5 h-14 text-sm font-medium border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors text-midnight-navy w-full lg:w-auto"
            >
              {CABIN_OPTIONS.find(c => c.value === cabin)?.label ?? "Economy"}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCabin ? "rotate-180" : ""}`} />
            </button>
            {showCabin && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 min-w-[180px]">
                {CABIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setCabin(opt.value); setShowCabin(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      cabin === opt.value ? "text-gold font-semibold" : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search inputs */}
          <div className="flex flex-1 flex-col md:flex-row gap-2 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
            {/* Origin */}
            <div className="flex-1 relative flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12">
              <MapPin className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                onKeyDown={handleKey}
                placeholder="From (e.g. DEL)"
                maxLength={3}
                className="w-full bg-transparent h-full pl-12 pr-4 text-base font-bold outline-none placeholder:font-normal placeholder:text-gray-400 text-midnight-navy tracking-widest"
              />
            </div>

            {/* Swap */}
            <button
              onClick={swap}
              className="hidden md:flex items-center justify-center w-10 h-12 shrink-0 text-gray-400 hover:text-gold transition-colors bg-gray-50 rounded-lg border border-gray-100 hover:border-gold/30"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Destination */}
            <div className="flex-1 relative flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12">
              <MapPin className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                onKeyDown={handleKey}
                placeholder="To (e.g. BOM)"
                maxLength={3}
                className="w-full bg-transparent h-full pl-12 pr-4 text-base font-bold outline-none placeholder:font-normal placeholder:text-gray-400 text-midnight-navy tracking-widest"
              />
            </div>

            {/* Date */}
            <div className="flex-[0.9] relative flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12">
              <Calendar className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent h-full pl-12 pr-4 text-base font-medium outline-none text-midnight-navy cursor-pointer"
              />
            </div>

            {/* Passengers */}
            <div className="flex items-center bg-gray-50 rounded-lg h-12 px-4 gap-3 border border-gray-100">
              <Users className="text-gray-400 w-5 h-5 shrink-0" />
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gold hover:text-midnight-navy transition-colors font-bold text-lg leading-none flex items-center justify-center text-gray-600"
              >−</button>
              <span className="text-base font-bold text-midnight-navy w-4 text-center">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(9, adults + 1))}
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gold hover:text-midnight-navy transition-colors font-bold text-lg leading-none flex items-center justify-center text-gray-600"
              >+</button>
              <span className="text-xs text-gray-500 ml-1">Adult{adults > 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={submit}
            disabled={loading || !origin || !destination || !date}
            className="btn-gold h-14 px-10 rounded-xl shrink-0 flex items-center justify-center gap-3 w-full lg:w-auto shadow-lg shadow-gold/20 hover:shadow-gold/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="font-bold text-base">
              {loading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
