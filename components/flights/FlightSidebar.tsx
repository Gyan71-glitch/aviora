"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Info, RotateCcw } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { Flight } from "@/app/flights/page";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface FilterState {
  stops: number[];                 // [] = all (0 = Direct, 1 = 1 stop, 2 = 2+ stops)
  airlines: string[];              // [] = all (airline codes)
  alliances: string[];             // [] = all ('oneworld', 'skyteam', 'star_alliance')
  airports: string[];              // [] = all (airport codes)
  stopoverAirports: string[];      // [] = all (city/airport names)
  cabins: string[];                // [] = all ('economy', 'premium_economy', 'business', 'first')
  aircrafts: string[];             // [] = all (aircraft names)
  departTimes: string[];           // [] = all ('morning', 'afternoon', 'evening', 'night')
  arrivalTimes: string[];          // [] = all ('morning', 'afternoon', 'evening', 'night')
  maxPrice: number;
  maxDurationMins: number;
  refundableOnly: boolean;
  transportTypes: string[];        // ['flights', 'flights+trains']
}

export const DEFAULT_FILTERS: FilterState = {
  stops: [],
  airlines: [],
  alliances: [],
  airports: [],
  stopoverAirports: [],
  cabins: [],
  aircrafts: [],
  departTimes: [],
  arrivalTimes: [],
  maxPrice: 999999,
  maxDurationMins: 9999,
  refundableOnly: false,
  transportTypes: ["flights"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function parseDuration(dur: string): number {
  if (!dur || dur === "N/A") return 9999;
  const m = dur.match(/(\d+)h\s*(\d+)m/);
  if (!m) return 9999;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

function getTimeBucket(timeStr: string): "morning" | "afternoon" | "evening" | "night" {
  if (!timeStr) return "morning";
  const hour = parseInt(timeStr.split(":")[0], 10);
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
}

const ONEWORLD_CODES = ["AA", "BA", "QR", "CX", "QF", "AY", "IB", "JL", "MH", "RJ", "AT", "UL"];
const SKYTEAM_CODES = ["DL", "AF", "KL", "ME", "SV", "AM", "CI", "GA", "AR", "KQ", "KE", "UX", "RO", "VS"];
const STAR_ALLIANCE_CODES = ["AI", "LH", "UA", "SQ", "AC", "NH", "ET", "MS", "BR", "NZ", "OS", "SN", "SK", "TP", "TG", "TK", "ZH"];

function toggleMultiSelect<T>(current: T[], item: T, allItems: T[]): T[] {
  if (current.length === 0) {
    // All selected by default -> clicking selects ONLY this item
    return [item];
  }
  if (current.includes(item)) {
    const next = current.filter((x) => x !== item);
    return next.length === 0 || next.length === allItems.length ? [] : next;
  } else {
    const next = [...current, item];
    return next.length === allItems.length ? [] : next;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function CheckboxRow({
  label,
  price,
  count,
  checked,
  onChange,
  info,
}: {
  label: React.ReactNode;
  price?: number;
  count?: number;
  checked: boolean;
  onChange: () => void;
  info?: boolean;
}) {
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        onChange();
      }}
      className="flex items-center justify-between cursor-pointer group py-1.5 hover:bg-slate-100/70 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
            checked ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-slate-300 group-hover:border-amber-400"
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-slate-800 text-xs font-semibold truncate flex items-center gap-1">
          {label}
          {count !== undefined && <span className="text-[11px] text-slate-400 font-normal">({count})</span>}
          {info && <Info className="w-3 h-3 text-slate-400 shrink-0" />}
        </span>
      </div>
      {price !== undefined && price !== Infinity && (
        <span className="text-xs font-bold text-slate-600 shrink-0 ml-2">
          ₹{price.toLocaleString("en-IN")}
        </span>
      )}
    </label>
  );
}

import { motion, AnimatePresence } from "framer-motion";

function SectionHeader({
  title,
  open,
  onToggle,
  rightEl,
}: {
  title: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  rightEl?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer py-1 select-none group"
      onClick={onToggle}
    >
      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider group-hover:text-amber-800 transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        {rightEl}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-800 transition-colors" />
        </motion.div>
      </div>
    </div>
  );
}

function SingleSlider({
  min,
  max,
  value,
  onChange,
  formatLabel,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  formatLabel: (v: number) => string;
}) {
  return (
    <div className="w-full pt-1 pb-2">
      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
        <span className="text-slate-400">Up to</span>
        <span className="text-amber-800">{formatLabel(value)}</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      >
        <Slider.Track className="bg-slate-200 relative grow rounded-full h-1.5 overflow-hidden">
          <Slider.Range className="absolute bg-gradient-to-r from-amber-500 to-amber-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4.5 h-4.5 bg-white border-2 border-amber-500 shadow-md rounded-full hover:scale-125 hover:shadow-amber-500/40 hover:border-amber-600 focus:scale-125 focus:outline-none transition-all duration-200 active:scale-95 cursor-grab active:cursor-grabbing" />
      </Slider.Root>
    </div>
  );
}

// ─── Main Sidebar Component ─────────────────────────────────────────────────
interface Props {
  flights: Flight[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  filteredCount: number;
}

export default function FlightSidebar({ flights, filters, onFiltersChange, filteredCount }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    stops: true,
    airports: true,
    times: true,
    airlines: true,
    alliance: true,
    transportation: true,
    duration: true,
    price: true,
    stopoverAirports: true,
    cabin: true,
    quality: true,
    aircraft: true,
  });

  const toggleSection = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const update = (partial: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...partial });

  // ── 1. Stopovers (Direct, 1 stop, 2+ stops) ──────────────────────────────
  const stopOptions = useMemo(() => {
    const buckets: { [key: number]: { count: number; minPrice: number; label: string } } = {
      0: { count: 0, minPrice: Infinity, label: "Direct (Non-stop)" },
      1: { count: 0, minPrice: Infinity, label: "1 Stop" },
      2: { count: 0, minPrice: Infinity, label: "2+ Stops" },
    };

    flights.forEach((f) => {
      const bucket = f.stops >= 2 ? 2 : f.stops;
      buckets[bucket].count += 1;
      if (f.price < buckets[bucket].minPrice) {
        buckets[bucket].minPrice = f.price;
      }
    });

    return Object.entries(buckets)
      .map(([k, v]) => ({ stopVal: parseInt(k), ...v }))
      .filter((opt) => opt.count > 0);
  }, [flights]);

  // ── 2. Airports (Origin & Destination) ──────────────────────────────────
  const originAirports = useMemo(() => {
    const map: { [code: string]: { name: string; city: string; count: number; minPrice: number } } = {};
    flights.forEach((f) => {
      const code = f.departure.airport.code;
      if (!map[code]) {
        map[code] = {
          name: f.departure.airport.name,
          city: f.departure.airport.city,
          count: 0,
          minPrice: Infinity,
        };
      }
      map[code].count += 1;
      if (f.price < map[code].minPrice) map[code].minPrice = f.price;
    });
    return Object.entries(map).map(([code, info]) => ({ code, ...info }));
  }, [flights]);

  const destAirports = useMemo(() => {
    const map: { [code: string]: { name: string; city: string; count: number; minPrice: number } } = {};
    flights.forEach((f) => {
      const code = f.arrival.airport.code;
      if (!map[code]) {
        map[code] = {
          name: f.arrival.airport.name,
          city: f.arrival.airport.city,
          count: 0,
          minPrice: Infinity,
        };
      }
      map[code].count += 1;
      if (f.price < map[code].minPrice) map[code].minPrice = f.price;
    });
    return Object.entries(map).map(([code, info]) => ({ code, ...info }));
  }, [flights]);

  // ── 3. Departure & Arrival Time Buckets ─────────────────────────────────
  const departTimeBuckets = useMemo(() => {
    const slots = [
      { id: "morning", label: "Morning", sub: "06:00 - 12:00" },
      { id: "afternoon", label: "Afternoon", sub: "12:00 - 18:00" },
      { id: "evening", label: "Evening", sub: "18:00 - 24:00" },
      { id: "night", label: "Night", sub: "00:00 - 06:00" },
    ];
    const map: { [key: string]: { count: number; minPrice: number } } = {
      morning: { count: 0, minPrice: Infinity },
      afternoon: { count: 0, minPrice: Infinity },
      evening: { count: 0, minPrice: Infinity },
      night: { count: 0, minPrice: Infinity },
    };
    flights.forEach((f) => {
      const bucket = getTimeBucket(f.departure.time);
      map[bucket].count += 1;
      if (f.price < map[bucket].minPrice) map[bucket].minPrice = f.price;
    });
    return slots.map((s) => ({ ...s, ...map[s.id] })).filter((s) => s.count > 0);
  }, [flights]);

  const arrivalTimeBuckets = useMemo(() => {
    const slots = [
      { id: "morning", label: "Morning", sub: "06:00 - 12:00" },
      { id: "afternoon", label: "Afternoon", sub: "12:00 - 18:00" },
      { id: "evening", label: "Evening", sub: "18:00 - 24:00" },
      { id: "night", label: "Night", sub: "00:00 - 06:00" },
    ];
    const map: { [key: string]: { count: number; minPrice: number } } = {
      morning: { count: 0, minPrice: Infinity },
      afternoon: { count: 0, minPrice: Infinity },
      evening: { count: 0, minPrice: Infinity },
      night: { count: 0, minPrice: Infinity },
    };
    flights.forEach((f) => {
      const bucket = getTimeBucket(f.arrival.time);
      map[bucket].count += 1;
      if (f.price < map[bucket].minPrice) map[bucket].minPrice = f.price;
    });
    return slots.map((s) => ({ ...s, ...map[s.id] })).filter((s) => s.count > 0);
  }, [flights]);

  // ── 4. Airlines List ─────────────────────────────────────────────────────
  const airlinesList = useMemo(() => {
    const map: { [code: string]: { name: string; logo: string; count: number; minPrice: number } } = {};
    flights.forEach((f) => {
      const code = f.airline.code;
      if (!map[code]) {
        map[code] = {
          name: f.airline.name,
          logo: f.airline.logo,
          count: 0,
          minPrice: Infinity,
        };
      }
      map[code].count += 1;
      if (f.price < map[code].minPrice) map[code].minPrice = f.price;
    });
    return Object.entries(map).map(([code, info]) => ({ code, ...info }));
  }, [flights]);

  // ── 5. Airline Alliances (oneworld, SkyTeam, Star Alliance) ─────────────
  const allianceList = useMemo(() => {
    const map: { [id: string]: { name: string; count: number; minPrice: number } } = {
      oneworld: { name: "oneworld", count: 0, minPrice: Infinity },
      skyteam: { name: "SkyTeam", count: 0, minPrice: Infinity },
      star_alliance: { name: "Star Alliance", count: 0, minPrice: Infinity },
    };

    flights.forEach((f) => {
      const code = f.airline.code.toUpperCase();
      if (ONEWORLD_CODES.includes(code)) {
        map.oneworld.count += 1;
        if (f.price < map.oneworld.minPrice) map.oneworld.minPrice = f.price;
      }
      if (SKYTEAM_CODES.includes(code)) {
        map.skyteam.count += 1;
        if (f.price < map.skyteam.minPrice) map.skyteam.minPrice = f.price;
      }
      if (STAR_ALLIANCE_CODES.includes(code)) {
        map.star_alliance.count += 1;
        if (f.price < map.star_alliance.minPrice) map.star_alliance.minPrice = f.price;
      }
    });

    return Object.entries(map).map(([id, info]) => ({ id, ...info })).filter((al) => al.count > 0);
  }, [flights]);

  // ── 6. Transportation Options (Flights, Flights + Trains) ────────────────
  const minFlightPrice = useMemo(() => {
    if (!flights.length) return undefined;
    return Math.min(...flights.map((f) => f.price));
  }, [flights]);

  // ── 7. Duration Bounds ───────────────────────────────────────────────────
  const maxDurationBound = useMemo(() => {
    if (!flights.length) return 3000;
    return Math.max(...flights.map((f) => parseDuration(f.duration)));
  }, [flights]);

  // ── 8. Price Bounds ──────────────────────────────────────────────────────
  const maxPriceBound = useMemo(() => {
    if (!flights.length) return 200000;
    return Math.max(...flights.map((f) => f.price));
  }, [flights]);

  const minPriceBound = useMemo(() => {
    if (!flights.length) return 0;
    return Math.min(...flights.map((f) => f.price));
  }, [flights]);

  // ── 9. Stopover Transit Airports ─────────────────────────────────────────
  const stopoverAirportsList = useMemo(() => {
    const map: { [city: string]: { count: number; minPrice: number } } = {};
    flights.forEach((f) => {
      if (f.stopCities && f.stopCities.length > 0) {
        f.stopCities.forEach((city) => {
          if (!map[city]) {
            map[city] = { count: 0, minPrice: Infinity };
          }
          map[city].count += 1;
          if (f.price < map[city].minPrice) map[city].minPrice = f.price;
        });
      }
    });
    return Object.entries(map).map(([city, info]) => ({ city, ...info }));
  }, [flights]);

  // ── 10. Cabin Classes ─────────────────────────────────────────────────────
  const cabinOptionsList = useMemo(() => {
    const ALL_CABINS = [
      { code: "economy", label: "Economy" },
      { code: "premium_economy", label: "Premium Economy" },
      { code: "business", label: "Business" },
      { code: "first", label: "First" },
    ];

    return ALL_CABINS.map((c) => {
      const matchingFlights = flights.filter((f) => {
        const raw = (f.cabin || "economy").toLowerCase();
        if (c.code === "economy") return raw === "economy" || raw === "1" || raw.includes("econ");
        if (c.code === "premium_economy") return raw.includes("premium") || raw === "3";
        if (c.code === "business") return raw.includes("business") || raw === "4";
        if (c.code === "first") return raw.includes("first") || raw === "6";
        return false;
      });

      const count = matchingFlights.length;
      const minPrice = count > 0 ? Math.min(...matchingFlights.map((f) => f.price)) : undefined;

      return {
        code: c.code,
        label: c.label,
        count,
        minPrice,
      };
    });
  }, [flights]);

  // ── 12. Aircraft Types ───────────────────────────────────────────────────
  const aircraftList = useMemo(() => {
    const map: { [name: string]: { count: number; minPrice: number } } = {};
    flights.forEach((f) => {
      const aircraftName = (f as any).aircraft || (f.airline.code === "AI" ? "Boeing 787 Dreamliner" : "Airbus A320neo");
      if (!map[aircraftName]) {
        map[aircraftName] = { count: 0, minPrice: Infinity };
      }
      map[aircraftName].count += 1;
      if (f.price < map[aircraftName].minPrice) map[aircraftName].minPrice = f.price;
    });
    return Object.entries(map).map(([name, info]) => ({ name, ...info }));
  }, [flights]);

  const fmtMins = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm.toString().padStart(2, "0")}m`;
  };

  const fmtPrice = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.alliances.length > 0 ||
    filters.airports.length > 0 ||
    filters.cabins.length > 0 ||
    filters.stopoverAirports.length > 0 ||
    filters.aircrafts.length > 0 ||
    filters.departTimes.length > 0 ||
    filters.arrivalTimes.length > 0 ||
    filters.refundableOnly ||
    filters.maxPrice < maxPriceBound ||
    filters.maxDurationMins < maxDurationBound;

  return (
    <aside className="flex flex-col text-sm w-full font-sans select-none pb-8">
      {/* Sidebar Header & Reset Button */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Filter Flights</h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of {flights.length}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors border border-amber-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ─── 1. STOPOVERS (STOPS) ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Stopover"
          open={open.stops}
          onToggle={() => toggleSection("stops")}
        />
        {open.stops && (
          <div className="mt-2 space-y-0.5">
            {stopOptions.map((opt) => (
              <CheckboxRow
                key={opt.stopVal}
                label={opt.label}
                price={opt.minPrice}
                count={opt.count}
                checked={filters.stops.length === 0 || filters.stops.includes(opt.stopVal)}
                onChange={() => update({ stops: toggleMultiSelect(filters.stops, opt.stopVal, stopOptions.map(s => s.stopVal)) })}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── 2. AIRPORTS (ORIGIN & DESTINATION) ──────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Airports"
          open={open.airports}
          onToggle={() => toggleSection("airports")}
        />
        {open.airports && (
          <div className="mt-2 space-y-3">
            {originAirports.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Origin</p>
                {originAirports.map((apt) => (
                  <CheckboxRow
                    key={apt.code}
                    label={`${apt.code}: ${apt.city}`}
                    price={apt.minPrice}
                    count={apt.count}
                    checked={filters.airports.length === 0 || filters.airports.includes(apt.code)}
                    onChange={() => update({ airports: toggleMultiSelect(filters.airports, apt.code, [...originAirports, ...destAirports].map(a => a.code)) })}
                  />
                ))}
              </div>
            )}
            {destAirports.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Destination</p>
                {destAirports.map((apt) => (
                  <CheckboxRow
                    key={apt.code}
                    label={`${apt.code}: ${apt.city}`}
                    price={apt.minPrice}
                    count={apt.count}
                    checked={filters.airports.length === 0 || filters.airports.includes(apt.code)}
                    onChange={() => update({ airports: toggleMultiSelect(filters.airports, apt.code, [...originAirports, ...destAirports].map(a => a.code)) })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 3. TIMES (TAKE-OFF & LANDING) ───────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Times"
          open={open.times}
          onToggle={() => toggleSection("times")}
        />
        {open.times && (
          <div className="mt-2 space-y-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Take-off</p>
              {departTimeBuckets.map((t) => (
                <CheckboxRow
                  key={t.id}
                  label={`${t.label} (${t.sub})`}
                  price={t.minPrice}
                  count={t.count}
                  checked={filters.departTimes.length === 0 || filters.departTimes.includes(t.id)}
                  onChange={() => update({ departTimes: toggleMultiSelect(filters.departTimes, t.id, departTimeBuckets.map(b => b.id)) })}
                />
              ))}
            </div>
            {arrivalTimeBuckets.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Landing</p>
                {arrivalTimeBuckets.map((t) => (
                  <CheckboxRow
                    key={t.id}
                    label={`${t.label} (${t.sub})`}
                    price={t.minPrice}
                    count={t.count}
                    checked={filters.arrivalTimes.length === 0 || filters.arrivalTimes.includes(t.id)}
                    onChange={() => update({ arrivalTimes: toggleMultiSelect(filters.arrivalTimes, t.id, arrivalTimeBuckets.map(b => b.id)) })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 4. AIRLINES ─────────────────────────────────────────────────── */}
      {airlinesList.length > 0 && (
        <div className="border-b border-slate-200 py-3">
          <div className="flex items-center justify-between mb-1">
            <SectionHeader
              title="Airlines"
              open={open.airlines}
              onToggle={() => toggleSection("airlines")}
            />
            {open.airlines && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <button
                  onClick={() => update({ airlines: [] })}
                  className="text-amber-700 hover:underline"
                >
                  All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => update({ airlines: airlinesList.map((a) => a.code) })}
                  className="text-slate-400 hover:underline"
                >
                  None
                </button>
              </div>
            )}
          </div>

          {open.airlines && (
            <div className="mt-2 space-y-0.5">
              {airlinesList.map((airline) => (
                <CheckboxRow
                  key={airline.code}
                  label={
                    <span className="flex items-center gap-2">
                      <img src={airline.logo} alt={airline.name} className="w-4 h-4 object-contain rounded shrink-0" />
                      <span className="truncate">{airline.name}</span>
                    </span>
                  }
                  price={airline.minPrice}
                  count={airline.count}
                  checked={filters.airlines.length === 0 || filters.airlines.includes(airline.code)}
                  onChange={() => update({ airlines: toggleMultiSelect(filters.airlines, airline.code, airlinesList.map(a => a.code)) })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. ALLIANCE (oneworld, SkyTeam, Star Alliance) ──────────────── */}
      {allianceList.length > 0 && (
        <div className="border-b border-slate-200 py-3">
          <SectionHeader
            title="Alliance"
            open={open.alliance}
            onToggle={() => toggleSection("alliance")}
          />
          {open.alliance && (
            <div className="mt-2 space-y-0.5">
              {allianceList.map((al) => (
                <CheckboxRow
                  key={al.id}
                  label={al.name}
                  price={al.minPrice}
                  count={al.count}
                  checked={filters.alliances.length === 0 || filters.alliances.includes(al.id)}
                  onChange={() => update({ alliances: toggleMultiSelect(filters.alliances, al.id, allianceList.map(a => a.id)) })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 6. TRANSPORTATION OPTIONS ────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Transportation Options"
          open={open.transportation}
          onToggle={() => toggleSection("transportation")}
        />
        {open.transportation && (
          <div className="mt-2 space-y-0.5">
            <CheckboxRow
              label="Flights"
              price={minFlightPrice}
              count={flights.length}
              checked={true}
              onChange={() => {}}
            />
            <CheckboxRow
              label="Flights + trains"
              count={0}
              checked={false}
              onChange={() => {}}
            />
          </div>
        )}
      </div>

      {/* ─── 7. DURATION ──────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Duration"
          open={open.duration}
          onToggle={() => toggleSection("duration")}
          rightEl={
            filters.maxDurationMins < maxDurationBound && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  update({ maxDurationMins: 9999 });
                }}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                Reset
              </button>
            )
          }
        />
        {open.duration && flights.length > 0 && (
          <div className="mt-2 space-y-3">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Flight Leg Duration</p>
              <SingleSlider
                min={60}
                max={maxDurationBound}
                value={Math.min(filters.maxDurationMins, maxDurationBound)}
                onChange={(val) => update({ maxDurationMins: val })}
                formatLabel={fmtMins}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── 8. PRICE ─────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Price"
          open={open.price}
          onToggle={() => toggleSection("price")}
          rightEl={
            filters.maxPrice < maxPriceBound && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  update({ maxPrice: 999999 });
                }}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                Reset
              </button>
            )
          }
        />
        {open.price && flights.length > 0 && (
          <div className="mt-2">
            <SingleSlider
              min={minPriceBound}
              max={maxPriceBound}
              value={Math.min(filters.maxPrice, maxPriceBound)}
              onChange={(val) => update({ maxPrice: val })}
              formatLabel={fmtPrice}
            />
          </div>
        )}
      </div>

      {/* ─── 9. STOPOVER AIRPORTS ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Stopover Airports"
          open={open.stopoverAirports}
          onToggle={() => toggleSection("stopoverAirports")}
        />
        {open.stopoverAirports && (
          <div className="mt-2 space-y-0.5">
            {stopoverAirportsList.length > 0 ? (
              stopoverAirportsList.map((apt) => (
                <CheckboxRow
                  key={apt.city}
                  label={apt.city}
                  price={apt.minPrice}
                  count={apt.count}
                  checked={filters.stopoverAirports.includes(apt.city)}
                  onChange={() => update({ stopoverAirports: toggleMultiSelect(filters.stopoverAirports, apt.city, stopoverAirportsList.map(a => a.city)) })}
                />
              ))
            ) : (
              <p className="text-xs text-slate-400 py-1 font-medium">No stopover airports for direct flights.</p>
            )}
          </div>
        )}
      </div>

      {/* ─── 10. CABIN ────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Cabin"
          open={open.cabin}
          onToggle={() => toggleSection("cabin")}
        />
        {open.cabin && (
          <div className="mt-2 space-y-0.5">
            {cabinOptionsList.length > 0 ? (
              cabinOptionsList.map((cb) => (
                <CheckboxRow
                  key={cb.code}
                  label={cb.label}
                  price={cb.minPrice}
                  count={cb.count}
                  checked={filters.cabins.length === 0 || filters.cabins.includes(cb.code)}
                  onChange={() => update({ cabins: toggleMultiSelect(filters.cabins, cb.code, cabinOptionsList.map(c => c.code)) })}
                />
              ))
            ) : (
              <CheckboxRow
                label="Economy"
                price={minFlightPrice}
                count={flights.length}
                checked={true}
                onChange={() => {}}
              />
            )}
          </div>
        )}
      </div>

      {/* ─── 11. FLIGHT QUALITY ───────────────────────────────────────────── */}
      <div className="border-b border-slate-200 py-3">
        <SectionHeader
          title="Flight Quality"
          open={open.quality}
          onToggle={() => toggleSection("quality")}
        />
        {open.quality && (
          <div className="mt-2 space-y-0.5">
            <CheckboxRow
              label="Refundable Tickets Only"
              checked={filters.refundableOnly}
              onChange={() => update({ refundableOnly: !filters.refundableOnly })}
            />
          </div>
        )}
      </div>

      {/* ─── 12. AIRCRAFT ─────────────────────────────────────────────────── */}
      <div className="py-3">
        <SectionHeader
          title="Aircraft"
          open={open.aircraft}
          onToggle={() => toggleSection("aircraft")}
        />
        {open.aircraft && (
          <div className="mt-2 space-y-0.5">
            {aircraftList.map((air) => (
              <CheckboxRow
                key={air.name}
                label={air.name}
                price={air.minPrice}
                count={air.count}
                checked={filters.aircrafts.length === 0 || filters.aircrafts.includes(air.name)}
                onChange={() => update({ aircrafts: toggleMultiSelect(filters.aircrafts, air.name, aircraftList.map(a => a.name)) })}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
