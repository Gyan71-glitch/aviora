"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Search, MapPin, X, Sparkles, Check, Building } from "lucide-react";

export interface AirportItem {
  code: string;
  city: string;
  country: string;
  airport: string;
  flagEmoji: string;
  popular?: boolean;
}

const QUICK_CHIPS: AirportItem[] = [
  { code: "DEL", city: "New Delhi", country: "India", airport: "Indira Gandhi Intl", flagEmoji: "🇮🇳" },
  { code: "BOM", city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj Intl", flagEmoji: "🇮🇳" },
  { code: "DXB", city: "Dubai", country: "UAE", airport: "Dubai Intl", flagEmoji: "🇦🇪" },
  { code: "BLR", city: "Bengaluru", country: "India", airport: "Kempegowda Intl", flagEmoji: "🇮🇳" },
  { code: "LHR", city: "London", country: "UK", airport: "Heathrow", flagEmoji: "🇬🇧" },
  { code: "SIN", city: "Singapore", country: "Singapore", airport: "Changi Airport", flagEmoji: "🇸🇬" },
  { code: "GOI", city: "Goa", country: "India", airport: "Dabolim / Mopa", flagEmoji: "🇮🇳" },
];

interface AirportSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: AirportItem) => void;
  selectedCode?: string;
  label: string;
}

export default function AirportSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedCode = "",
  label,
}: AirportSelectorModalProps) {
  const [query, setQuery] = useState("");
  const [airports, setAirports] = useState<AirportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (dropdownRef.current) {
          const rect = dropdownRef.current.getBoundingClientRect();
          const viewHeight = window.innerHeight || document.documentElement.clientHeight;
          if (rect.bottom > viewHeight) {
            window.scrollBy({
              top: rect.bottom - viewHeight + 40,
              behavior: "smooth",
            });
          }
        }
      }, 150);
      fetchAirports("");
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const fetchAirports = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/airports/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setAirports(data.airports);
      }
    } catch (err) {
      console.error("Failed to fetch airports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    fetchAirports(val);
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-[100]">
      {/* Dropdown Container Card */}
      <div
        ref={dropdownRef}
        className="absolute left-0 top-full mt-2 w-full min-w-[340px] md:w-[460px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/90 p-4 z-[100] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header & Search Bar */}
        <div className="relative mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              {label} • Realtime Search
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by City, Airport Name, or IATA Code (e.g. DEL, Dubai)..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Select Chips */}
        {!query && (
          <div className="mb-3 pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Popular Cities
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.code}
                  type="button"
                  onClick={() => {
                    onSelect(chip);
                    onClose();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                    selectedCode === chip.code
                      ? "bg-midnight-navy text-white border-midnight-navy shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950"
                  }`}
                >
                  <span>{chip.flagEmoji}</span>
                  <span>{chip.city}</span>
                  <span className="text-[10px] opacity-75 font-mono">({chip.code})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Airport Results List */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium animate-pulse flex items-center justify-center gap-2">
              <Plane className="w-4 h-4 text-gold-dark animate-bounce" />
              Searching airports via API Ninjas...
            </div>
          ) : airports.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No airports found for &quot;{query}&quot;. Try IATA code (e.g. DEL, BOM).
            </div>
          ) : (
            airports.map((item) => {
              const isSelected = selectedCode.toUpperCase().includes(item.code);
              return (
                <div
                  key={item.code}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`p-2.5 rounded-2xl cursor-pointer flex items-center justify-between transition-all border ${
                    isSelected
                      ? "bg-amber-500/10 border-gold/50 shadow-sm"
                      : "bg-white border-slate-100 hover:border-gold/40 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-midnight-navy flex flex-col items-center justify-center shrink-0 border border-gold/30 shadow-sm">
                      <span className="text-xs font-bold font-mono text-gold leading-none">{item.code}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-midnight-navy truncate">{item.city}</span>
                        <span className="text-xs">{item.flagEmoji}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        {item.airport} • <span className="text-slate-400">{item.country}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-gold text-midnight-navy font-bold shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
