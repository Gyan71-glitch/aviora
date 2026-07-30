"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { Flight } from "@/app/flights/page";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface FilterState {
  stops: number[];          // [] = all
  airlines: string[];       // [] = all
  maxPrice: number;
  maxDurationMins: number;
  cabins: string[];         // [] = all
  refundable: boolean | null; // null = all
  transportTypes: string[]; // ['flights', 'flights+trains']
}

export const DEFAULT_FILTERS: FilterState = {
  stops: [],
  airlines: [],
  maxPrice: 999999,
  maxDurationMins: 9999,
  cabins: [],
  refundable: null,
  transportTypes: ["flights"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseDuration(dur: string): number {
  if (!dur || dur === "N/A") return 9999;
  const m = dur.match(/(\d+)h\s*(\d+)m/);
  if (!m) return 9999;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function CheckboxRow({
  label,
  price,
  checked,
  onChange,
  info,
}: {
  label: React.ReactNode;
  price?: number;
  checked: boolean;
  onChange: () => void;
  info?: boolean;
}) {
  return (
    <label
      onClick={onChange}
      className="flex items-center justify-between cursor-pointer group py-1.5 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            checked ? "bg-[#D4AF37] border-[#D4AF37]" : "bg-white border-gray-300"
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-gray-700 text-[13px] truncate flex items-center gap-1.5">
          {label}
          {info && <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
        </span>
      </div>
      {price !== undefined && price !== Infinity && (
        <span className="text-[13px] text-gray-500 shrink-0 ml-2">
          ₹{price.toLocaleString("en-IN")}
        </span>
      )}
    </label>
  );
}

function SectionHeader({
  title,
  sectionKey,
  open,
  onToggle,
  rightEl,
}: {
  title: React.ReactNode;
  sectionKey: string;
  open: boolean;
  onToggle: () => void;
  rightEl?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer py-1"
      onClick={onToggle}
    >
      <h3 className="font-bold text-gray-900 text-[14px]">{title}</h3>
      <div className="flex items-center gap-2">
        {rightEl}
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}

function DualSlider({
  min,
  max,
  values,
  onChange,
  formatLabel,
}: {
  min: number;
  max: number;
  values: [number, number];
  onChange: (v: [number, number]) => void;
  formatLabel: (v: number) => string;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] text-gray-500 mb-2">
        <span>{formatLabel(values[0])}</span>
        <span>{formatLabel(values[1])}</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={1}
        value={values}
        onValueChange={(v) => onChange(v as [number, number])}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-[#3399cc] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 shadow rounded-full hover:bg-gray-50 focus:outline-none" />
        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 shadow rounded-full hover:bg-gray-50 focus:outline-none" />
      </Slider.Root>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
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
    price: false,
    stopoverAirports: false,
    cabin: false,
    flightQuality: false,
    aircraft: false,
    bookingSites: false,
    bookOnKayak: false,
  });

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const update = (partial: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...partial });

  // ── Derived filter options ──────────────────────────────────────────────
  const airlineMap = useMemo(
    () =>
      flights.reduce((acc, f) => {
        if (!acc[f.airline.code]) acc[f.airline.code] = f.airline.name;
        return acc;
      }, {} as Record<string, string>),
    [flights]
  );
  const airlineCodes = Object.keys(airlineMap);

  const originAirports = useMemo(() => {
    const seen = new Set<string>();
    return flights
      .filter((f) => {
        if (seen.has(f.departure.airport.code)) return false;
        seen.add(f.departure.airport.code);
        return true;
      })
      .map((f) => ({
        code: f.departure.airport.code,
        name: f.departure.airport.name,
        city: f.departure.airport.city,
        minPrice: flights
          .filter((x) => x.departure.airport.code === f.departure.airport.code)
          .reduce((m, x) => Math.min(m, x.price), Infinity),
      }));
  }, [flights]);

  const destAirports = useMemo(() => {
    const seen = new Set<string>();
    return flights
      .filter((f) => {
        if (seen.has(f.arrival.airport.code)) return false;
        seen.add(f.arrival.airport.code);
        return true;
      })
      .map((f) => ({
        code: f.arrival.airport.code,
        name: f.arrival.airport.name,
        city: f.arrival.airport.city,
        minPrice: flights
          .filter((x) => x.arrival.airport.code === f.arrival.airport.code)
          .reduce((m, x) => Math.min(m, x.price), Infinity),
      }));
  }, [flights]);

  const stopCounts = useMemo(
    () =>
      [0, 1, 2].map((s) => ({
        stops: s,
        label: s === 0 ? "Direct" : s === 1 ? "1 stop" : "2+ stops",
        min: flights
          .filter((f) => (s === 2 ? f.stops >= 2 : f.stops === s))
          .reduce((m, f) => Math.min(m, f.price), Infinity),
      })),
    [flights]
  );

  const priceRange = useMemo(() => {
    if (!flights.length) return { min: 0, max: 200000 };
    return {
      min: Math.floor(Math.min(...flights.map((f) => f.price))),
      max: Math.ceil(Math.max(...flights.map((f) => f.price))),
    };
  }, [flights]);

  const durRange = useMemo(() => {
    if (!flights.length) return { min: 0, max: 3600 };
    const durations = flights.map((f) => parseDuration(f.duration));
    return {
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }, [flights]);

  // ── Local slider state (for sliders that need local control) ─────────────
  const [priceSlider, setPriceSlider] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [durSlider, setDurSlider] = useState<[number, number]>([0, durRange.max]);
  const [takeoffSlider, setTakeoffSlider] = useState<[number, number]>([0, 1440]);
  const [landingSlider, setLandingSlider] = useState<[number, number]>([0, 1440]);

  const fmtMins = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm.toString().padStart(2, "0")}m`;
  };

  const fmtTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const period = h < 12 ? "AM" : "PM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const fmtPrice = (v: number) =>
    `₹${v.toLocaleString("en-IN")}`;

  // ── Stops toggle ──────────────────────────────────────────────────────────
  const toggleStop = (s: number) => {
    const next = filters.stops.includes(s)
      ? filters.stops.filter((x) => x !== s)
      : [...filters.stops, s];
    update({ stops: next });
  };

  const isStopChecked = (s: number) =>
    filters.stops.length === 0 || filters.stops.includes(s);

  // ── Airlines ──────────────────────────────────────────────────────────────
  const toggleAirline = (code: string) => {
    const next = filters.airlines.includes(code)
      ? filters.airlines.filter((x) => x !== code)
      : [...filters.airlines, code];
    update({ airlines: next });
  };

  const isAirlineChecked = (code: string) =>
    filters.airlines.length === 0 || filters.airlines.includes(code);

  return (
    <aside className="flex flex-col text-sm w-full font-sans select-none pb-12 space-y-0">

      {/* Results count */}
      <div className="text-gray-500 text-xs mb-5">
        <span className="text-gray-900 font-bold">{filteredCount}</span>
        {" "}of{" "}
        <span className="font-semibold">{flights.length}</span> flights
      </div>

      {/* ─── 1. Stops ──────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h3 className="font-bold text-gray-900 mb-3 text-[14px]">Stops</h3>
        <div className="flex flex-col gap-0.5">
          {stopCounts.map(({ stops, label, min }) => (
            <CheckboxRow
              key={stops}
              label={label}
              price={min}
              checked={isStopChecked(stops)}
              onChange={() => toggleStop(stops)}
            />
          ))}
        </div>
      </div>

      {/* ─── 2. Airports ──────────────────────────────────────────────────── */}
      {flights.length > 0 && (
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3 text-[14px]">Airports</h3>
          {originAirports.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-500 text-[12px] uppercase tracking-wide mb-2">
                {originAirports[0]?.city || "Origin"}
              </h4>
              {originAirports.map((apt) => (
                <CheckboxRow
                  key={apt.code}
                  label={`${apt.code}: ${apt.name}`}
                  price={apt.minPrice}
                  checked={true}
                  onChange={() => {}}
                />
              ))}
            </div>
          )}
          {destAirports.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-500 text-[12px] uppercase tracking-wide mb-2">
                {destAirports[0]?.city || "Destination"}
              </h4>
              {destAirports.map((apt) => (
                <CheckboxRow
                  key={apt.code}
                  label={`${apt.code}: ${apt.name}`}
                  price={apt.minPrice}
                  checked={true}
                  onChange={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 3. Times ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-[14px]">Times</h3>
        <div className="mb-5">
          <p className="text-[13px] text-gray-700 mb-3">
            Take-off from{" "}
            <span className="font-semibold">{originAirports[0]?.code ?? "—"}</span>
          </p>
          <DualSlider
            min={0}
            max={1440}
            values={takeoffSlider}
            onChange={setTakeoffSlider}
            formatLabel={fmtTime}
          />
        </div>
        <div>
          <p className="text-[13px] text-gray-700 mb-3">
            Landing at{" "}
            <span className="font-semibold">{destAirports[0]?.code ?? "—"}</span>
          </p>
          <DualSlider
            min={0}
            max={1440}
            values={landingSlider}
            onChange={setLandingSlider}
            formatLabel={fmtTime}
          />
        </div>
      </div>

      {/* ─── 4. Airlines ──────────────────────────────────────────────────── */}
      {airlineCodes.length > 0 && (
        <div className="border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-[14px]">Airlines</h3>
            <div className="flex gap-2 text-[13px]">
              <button
                onClick={() => update({ airlines: [] })}
                className="text-[#3399cc] font-medium hover:underline"
              >
                Select all
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => update({ airlines: airlineCodes })}
                className="text-gray-500 hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            {airlineCodes.slice(0, 6).map((code) => {
              const cheapest = flights
                .filter((f) => f.airline.code === code)
                .reduce((m, f) => Math.min(m, f.price), Infinity);
              return (
                <CheckboxRow
                  key={code}
                  label={airlineMap[code]}
                  price={cheapest}
                  checked={isAirlineChecked(code)}
                  onChange={() => toggleAirline(code)}
                />
              );
            })}
            <CheckboxRow
              label="Multiple airlines"
              info
              checked={false}
              onChange={() => {}}
            />
            {airlineCodes.length > 6 && (
              <button className="text-left text-[13px] text-[#3399cc] mt-1 hover:underline">
                Show {airlineCodes.length - 6} more airlines
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── 5. Alliance ──────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h3 className="font-bold text-gray-900 mb-3 text-[14px]">Alliance</h3>
        <div className="flex flex-col gap-0.5">
          <CheckboxRow label="oneworld" price={26850} checked={false} onChange={() => {}} />
          <CheckboxRow label="SkyTeam" price={26140} checked={false} onChange={() => {}} />
          <CheckboxRow label="Star Alliance" price={29880} checked={false} onChange={() => {}} />
        </div>
      </div>

      {/* ─── 6. Transportation options ─────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-3 mb-3">
        <SectionHeader
          title="Transportation options"
          sectionKey="transportation"
          open={open.transportation}
          onToggle={() => toggle("transportation")}
        />
        {open.transportation && (
          <div className="mt-3 flex flex-col gap-0.5">
            <CheckboxRow label="Flights" price={flights.length ? Math.min(...flights.map(f => f.price)) : undefined} checked={true} onChange={() => {}} />
            <CheckboxRow label="Flights + trains" price={363990} checked={false} onChange={() => {}} />
          </div>
        )}
      </div>

      {/* ─── 7. Duration ──────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-3 mb-3">
        <SectionHeader
          title="Duration"
          sectionKey="duration"
          open={open.duration}
          onToggle={() => toggle("duration")}
          rightEl={
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDurSlider([0, durRange.max]);
                update({ maxDurationMins: 9999 });
              }}
              className="text-[13px] text-[#3399cc] hover:underline"
            >
              Reset
            </button>
          }
        />
        {open.duration && (
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-[13px] text-gray-700 mb-3">Flight leg</p>
              <DualSlider
                min={durRange.min}
                max={durRange.max}
                values={[durRange.min, durSlider[1]]}
                onChange={([, max]) => {
                  setDurSlider([durRange.min, max]);
                  update({ maxDurationMins: max });
                }}
                formatLabel={fmtMins}
              />
            </div>
            <div>
              <p className="text-[13px] text-gray-700 mb-3">Stopover</p>
              <DualSlider
                min={0}
                max={1480}
                values={[0, 1480]}
                onChange={() => {}}
                formatLabel={fmtMins}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── 8. Price ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-3 mb-3">
        <SectionHeader
          title="Price"
          sectionKey="price"
          open={open.price}
          onToggle={() => toggle("price")}
        />
        {open.price && flights.length > 0 && (
          <div className="mt-4">
            <DualSlider
              min={priceRange.min}
              max={priceRange.max}
              values={[priceRange.min, priceSlider[1]]}
              onChange={([, max]) => {
                setPriceSlider([priceRange.min, max]);
                update({ maxPrice: max });
              }}
              formatLabel={fmtPrice}
            />
          </div>
        )}
      </div>

      {/* ─── 9-14. Collapsed accordions ───────────────────────────────────── */}
      {[
        { key: "stopoverAirports", label: "Stopover airports" },
        { key: "cabin", label: "Cabin" },
        { key: "flightQuality", label: "Flight quality" },
        { key: "aircraft", label: "Aircraft" },
        { key: "bookingSites", label: "Booking sites" },
      ].map(({ key, label }) => (
        <div key={key} className="border-b border-gray-100 pb-3 mb-3">
          <SectionHeader
            title={label}
            sectionKey={key}
            open={open[key] ?? false}
            onToggle={() => toggle(key)}
          />
        </div>
      ))}

      {/* Book on Aviora */}
      <div className="border-b border-gray-100 pb-3">
        <SectionHeader
          title={
            <span className="flex items-center gap-1.5">
              Book on Aviora{" "}
              <span className="text-[#ff690f] text-sm font-bold">⚡</span>
            </span>
          }
          sectionKey="bookOnKayak"
          open={open.bookOnKayak ?? false}
          onToggle={() => toggle("bookOnKayak")}
        />
      </div>
    </aside>
  );
}
