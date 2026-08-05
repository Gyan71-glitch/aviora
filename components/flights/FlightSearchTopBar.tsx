"use client";

import { useState, useRef } from "react";
import {
  MapPin, Calendar, Users, Search, ChevronDown, Plus, Minus, Trash2, Loader2, ArrowRightLeft
} from "lucide-react";
import { SearchParams } from "@/app/flights/page";
import AirportSelectorModal from "@/components/flights/AirportSelectorModal";
import FareTypeSelector, { FareType } from "@/components/flights/FareTypeSelector";

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
  const [tripType, setTripType] = useState<"one_way" | "return" | "multi_city">(
    params.tripType || "one_way"
  );
  const [origin, setOrigin] = useState(params.origin || "DEL");
  const [destination, setDestination] = useState(params.destination || "BOM");
  const [date, setDate] = useState(params.date || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState(params.returnDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);

  // Multi-city legs state with per-leg travellers & cabin class
  const [legs, setLegs] = useState<
    {
      origin: string;
      destination: string;
      date: string;
      adults: number;
      children: number;
      infants: number;
      childAges: string[];
      cabin: "Economy" | "Premium Economy" | "Business" | "First";
    }[]
  >(
    params.legs && params.legs.length > 0
      ? params.legs.map((l: any) => ({
          origin: l.origin,
          destination: l.destination,
          date: l.date,
          adults: l.adults || 1,
          children: l.children || 0,
          infants: l.infants || 0,
          childAges: l.childAges || [],
          cabin: l.cabin || "Economy",
        }))
      : [
          {
            origin: "DEL",
            destination: "BOM",
            date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
            adults: 1,
            children: 0,
            infants: 0,
            childAges: [],
            cabin: "Economy",
          },
          {
            origin: "BOM",
            destination: "BLR",
            date: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
            adults: 1,
            children: 0,
            infants: 0,
            childAges: [],
            cabin: "Economy",
          },
        ]
  );

  // Dropdown states
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [topActiveTravellerPopup, setTopActiveTravellerPopup] = useState<"one_way_return" | number | "multi_city_bottom" | null>(null);

  const topDepartDateRef = useRef<HTMLInputElement>(null);
  const topReturnDateRef = useRef<HTMLInputElement>(null);
  const [topActiveMultiCityDropdown, setTopActiveMultiCityDropdown] = useState<{ legIdx: number; field: "origin" | "destination" } | null>(null);
  const [topActiveLegTravellersIdx, setTopActiveLegTravellersIdx] = useState<number | null>(null);
  const topMultiCityDateRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [adults, setAdults] = useState(params.adults || 1);
  const [childrenCount, setChildrenCount] = useState(params.children || 0);
  const [childAges, setChildAges] = useState<string[]>(params.childAges || []);
  const [infantsCount, setInfantsCount] = useState(params.infants || 0);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business" | "First">(
    (params.cabin as any) || "Economy"
  );
  const [fareType, setFareType] = useState<FareType>((params.fareType as FareType) || "regular");
  const [priceDropProtection, setPriceDropProtection] = useState<boolean>(params.priceDropProtection || false);

  const totalTravellers = adults + childrenCount + infantsCount;
  const travellersLabel = `${totalTravellers} ${totalTravellers === 1 ? "traveller" : "travellers"}, ${cabinClass}`;

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleChildrenChange = (newCount: number) => {
    setChildrenCount(newCount);
    if (newCount > childAges.length) {
      const added = Array.from({ length: newCount - childAges.length }).map(() => "Age");
      setChildAges([...childAges, ...added]);
    } else {
      setChildAges(childAges.slice(0, newCount));
    }
  };

  const updateChildAge = (idx: number, age: string) => {
    const next = [...childAges];
    next[idx] = age;
    setChildAges(next);
  };

  const addLeg = () => {
    if (legs.length >= 4) return;
    const lastLeg = legs[legs.length - 1];
    const newIdx = legs.length;
    setLegs([
      ...legs,
      {
        origin: lastLeg ? lastLeg.destination : "BLR",
        destination: "DEL",
        date: new Date(Date.now() + (7 + legs.length * 3) * 86400000).toISOString().split("T")[0],
        adults: 1,
        children: 0,
        infants: 0,
        childAges: [],
        cabin: "Economy",
      },
    ]);
    setTimeout(() => {
      setTopActiveMultiCityDropdown({ legIdx: newIdx, field: "destination" });
    }, 150);
  };

  const removeLeg = (index: number) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter((_, idx) => idx !== index));
  };

  const updateLeg = (index: number, field: string, value: string) => {
    const next = [...legs];
    next[index] = { ...next[index], [field]: value };
    setLegs(next);
  };

  const submitWithFareType = (ft = fareType, pdp = priceDropProtection) => {
    if (tripType === "multi_city") {
      onSearch({
        tripType: "multi_city",
        origin: legs[0]?.origin || "DEL",
        destination: legs[legs.length - 1]?.destination || "BOM",
        date: legs[0]?.date || date,
        legs,
        adults,
        children: childrenCount,
        infants: infantsCount,
        childAges,
        cabin: cabinClass,
        fareType: ft,
        priceDropProtection: pdp,
      });
    } else if (tripType === "return") {
      onSearch({
        tripType: "return",
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        date,
        returnDate,
        adults,
        children: childrenCount,
        infants: infantsCount,
        childAges,
        cabin: cabinClass,
        fareType: ft,
        priceDropProtection: pdp,
      });
    } else {
      onSearch({
        tripType: "one_way",
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        date,
        adults,
        children: childrenCount,
        infants: infantsCount,
        childAges,
        cabin: cabinClass,
        fareType: ft,
        priceDropProtection: pdp,
      });
    }
  };

  const submit = () => submitWithFareType(fareType, priceDropProtection);

  const renderTravellersPopoverContent = (onClose: () => void) => {
    return (
      <div className="absolute right-0 top-full mt-2 w-full md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 p-6 space-y-6 text-left">
        {/* Travellers Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Travellers</h4>

          {/* Adults */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-800">Adults</span>{" "}
              <span className="text-[11px] text-gray-400 font-medium">18+</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-gray-900 w-4 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(9, adults + 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-800">Children</span>{" "}
              <span className="text-[11px] text-gray-400 font-medium">0-17</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(Math.max(0, childrenCount - 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-gray-900 w-4 text-center">{childrenCount}</span>
              <button
                type="button"
                onClick={() => handleChildrenChange(Math.min(6, childrenCount + 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Child's age Selectors */}
          {childrenCount > 0 && (
            <div className="py-3 space-y-2 border-b border-gray-100">
              {childAges.map((age, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Child {idx + 1}&apos;s age</span>
                  <select
                    value={age}
                    onChange={(e) => updateChildAge(idx, e.target.value)}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-gold cursor-pointer shadow-sm"
                  >
                    <option value="Age">Age</option>
                    <option value="0">Under 1 year</option>
                    {Array.from({ length: 17 }).map((_, i) => (
                      <option key={i + 1} value={`${i + 1}`}>
                        {i + 1} year{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Infants on lap */}
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-xs font-bold text-gray-800">Infants on lap</span>{" "}
              <span className="text-[11px] text-gray-400 font-medium">under 2</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-gray-900 w-4 text-center">{infantsCount}</span>
              <button
                type="button"
                onClick={() => setInfantsCount(Math.min(adults, infantsCount + 1))}
                className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cabin Class Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Cabin class</h4>
          <div className="grid grid-cols-2 gap-2">
            {(["Economy", "Premium Economy", "Business", "First"] as const).map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setCabinClass(cls)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  cabinClass === cls
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-gold w-full py-2.5 rounded-xl font-bold text-xs shadow-md"
        >
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 py-3.5 shadow-xs transition-all">
      <div className="container-aviora">

        {/* Top Header: Trip Type Tabs & Popular Routes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

          {/* Trip Type Selector Tabs (One-Way | Return | Multi-City) */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start">
            {(
              [
                { id: "one_way", label: "One-Way" },
                { id: "return", label: "Return (Round Trip)" },
                { id: "multi_city", label: "Multi-City" },
              ] as const
            ).map((type) => (
              <button
                key={type.id}
                onClick={() => setTripType(type.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tripType === type.id
                    ? "bg-midnight-navy text-white shadow-sm"
                    : "text-gray-600 hover:text-midnight-navy hover:bg-white/60"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Quick route chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {POPULAR_ROUTES.map((r) => (
              <button
                key={r.label}
                onClick={() => { setOrigin(r.origin); setDestination(r.destination); setTripType("one_way"); }}
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
        </div>

        {/* ── 1-WAY & RETURN FLIGHT SEARCH FORM ───────────────────────────── */}
        {tripType !== "multi_city" && (
          <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">

            {/* Inputs Container */}
            <div className="flex flex-1 flex-col md:flex-row gap-2 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
              {/* Origin */}
              <div className="flex-1 relative">
                <div
                  onClick={() => {
                    setShowOriginDropdown(!showOriginDropdown);
                    setShowDestinationDropdown(false);
                    setTopActiveTravellerPopup(null);
                  }}
                  className="flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12 px-4 cursor-pointer border border-transparent hover:border-gold/30"
                >
                  <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                  <span className="text-base font-bold text-midnight-navy truncate">{origin}</span>
                </div>

                <AirportSelectorModal
                  isOpen={showOriginDropdown}
                  onClose={() => setShowOriginDropdown(false)}
                  onSelect={(airport) => {
                    setOrigin(airport.code);
                    setShowOriginDropdown(false);
                    // Auto-flow Step 2: Open Destination Dropdown
                    setTimeout(() => {
                      setShowDestinationDropdown(true);
                    }, 150);
                  }}
                  selectedCode={origin}
                  label="Origin (From)"
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
              <div className="flex-1 relative">
                <div
                  onClick={() => {
                    setShowDestinationDropdown(!showDestinationDropdown);
                    setShowOriginDropdown(false);
                    setTopActiveTravellerPopup(null);
                  }}
                  className="flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12 px-4 cursor-pointer border border-transparent hover:border-gold/30"
                >
                  <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                  <span className="text-base font-bold text-midnight-navy truncate">{destination}</span>
                </div>

                <AirportSelectorModal
                  isOpen={showDestinationDropdown}
                  onClose={() => setShowDestinationDropdown(false)}
                  onSelect={(airport) => {
                    setDestination(airport.code);
                    setShowDestinationDropdown(false);
                    // Auto-flow Step 3: Focus/Trigger Departure Date
                    setTimeout(() => {
                      if (topDepartDateRef.current) {
                        topDepartDateRef.current.focus();
                        if (typeof (topDepartDateRef.current as any).showPicker === "function") {
                          (topDepartDateRef.current as any).showPicker();
                        }
                      }
                    }, 150);
                  }}
                  selectedCode={destination}
                  label="Destination (To)"
                />
              </div>

              {/* Departure Date */}
              <div className="flex-[0.9] relative flex items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-12">
                <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
                <input
                  ref={topDepartDateRef}
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTimeout(() => {
                      if (tripType === "return" && topReturnDateRef.current) {
                        topReturnDateRef.current.focus();
                        if (typeof (topReturnDateRef.current as any).showPicker === "function") {
                          (topReturnDateRef.current as any).showPicker();
                        }
                      } else {
                        setTopActiveTravellerPopup("one_way_return");
                      }
                    }, 150);
                  }}
                  className="w-full bg-transparent h-full pl-9 pr-2 text-xs font-bold outline-none text-midnight-navy cursor-pointer"
                />
              </div>

              {/* Return Date (Visible for Return flights) */}
              {tripType === "return" && (
                <div className="flex-[0.9] relative flex items-center bg-amber-50 rounded-lg hover:bg-amber-100/80 transition-colors h-12 border border-amber-200">
                  <Calendar className="absolute left-3 text-amber-700 w-4 h-4" />
                  <input
                    ref={topReturnDateRef}
                    type="date"
                    value={returnDate}
                    min={date}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      setTimeout(() => {
                        setTopActiveTravellerPopup("one_way_return");
                      }, 150);
                    }}
                    className="w-full bg-transparent h-full pl-9 pr-2 text-xs font-bold outline-none text-amber-950 cursor-pointer"
                  />
                </div>
              )}

              {/* KAYAK-STYLE TRAVELLERS & CABIN CLASS POPOVER */}
              <div className="relative shrink-0 flex-1">
                <button
                  type="button"
                  onClick={() => setTopActiveTravellerPopup(topActiveTravellerPopup === "one_way_return" ? null : "one_way_return")}
                  className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-4 h-12 text-xs font-bold border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors text-midnight-navy w-full"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{travellersLabel}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${topActiveTravellerPopup === "one_way_return" ? "rotate-180" : ""}`} />
                </button>

                {topActiveTravellerPopup === "one_way_return" && renderTravellersPopoverContent(() => {
                  setTopActiveTravellerPopup(null);
                })}
              </div>

            </div>

            {/* Search Button */}
            <button
              onClick={submit}
              disabled={loading || !origin || !destination || !date}
              className="btn-gold h-14 px-8 rounded-xl shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              <span className="font-bold text-sm">{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        )}

        {/* ── MAKE MY TRIP FARE TYPE SELECTION ROW ───────────────────────── */}
        <div className="mt-3 border-t border-gray-100 pt-2">
          <FareTypeSelector
            fareType={fareType}
            onChangeFareType={(ft) => {
              setFareType(ft);
              submitWithFareType(ft, priceDropProtection);
            }}
            priceDropProtection={priceDropProtection}
            onChangePriceDropProtection={(val) => {
              setPriceDropProtection(val);
              submitWithFareType(fareType, val);
            }}
          />
        </div>

        {/* ── MULTI-CITY FLIGHT SEARCH FORM ──────────────────────────────── */}
        {tripType === "multi_city" && (
          <div className="flex flex-col gap-3 w-full bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            {legs.map((leg, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-2.5">
                <span className="text-xs font-bold font-mono text-slate-500 w-14 shrink-0">
                  Leg {idx + 1}:
                </span>

                {/* Leg From */}
                <div className="flex-1 w-full relative">
                  <div
                    onClick={() =>
                      setTopActiveMultiCityDropdown(
                        topActiveMultiCityDropdown?.legIdx === idx && topActiveMultiCityDropdown?.field === "origin"
                          ? null
                          : { legIdx: idx, field: "origin" }
                      )
                    }
                    className="flex items-center bg-gray-50 rounded-xl border border-gray-200 h-12 px-3 cursor-pointer hover:border-gold transition-colors"
                  >
                    <MapPin className="text-gray-400 w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs font-bold text-midnight-navy truncate">{leg.origin}</span>
                  </div>

                  <AirportSelectorModal
                    isOpen={topActiveMultiCityDropdown?.legIdx === idx && topActiveMultiCityDropdown?.field === "origin"}
                    onClose={() => setTopActiveMultiCityDropdown(null)}
                    onSelect={(airport) => {
                      updateLeg(idx, "origin", airport.code);
                      setTopActiveMultiCityDropdown(null);
                      // Auto-flow Step 2: Open Leg destination
                      setTimeout(() => {
                        setTopActiveMultiCityDropdown({ legIdx: idx, field: "destination" });
                      }, 150);
                    }}
                    selectedCode={leg.origin}
                    label={`Leg ${idx + 1} Origin`}
                  />
                </div>

                {/* Leg To */}
                <div className="flex-1 w-full relative">
                  <div
                    onClick={() =>
                      setTopActiveMultiCityDropdown(
                        topActiveMultiCityDropdown?.legIdx === idx && topActiveMultiCityDropdown?.field === "destination"
                          ? null
                          : { legIdx: idx, field: "destination" }
                      )
                    }
                    className="flex items-center bg-gray-50 rounded-xl border border-gray-200 h-12 px-3 cursor-pointer hover:border-gold transition-colors"
                  >
                    <MapPin className="text-gray-400 w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs font-bold text-midnight-navy truncate">{leg.destination}</span>
                  </div>

                  <AirportSelectorModal
                    isOpen={topActiveMultiCityDropdown?.legIdx === idx && topActiveMultiCityDropdown?.field === "destination"}
                    onClose={() => setTopActiveMultiCityDropdown(null)}
                    onSelect={(airport) => {
                      setLegs((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], destination: airport.code };
                        if (idx + 1 < next.length) {
                          next[idx + 1] = { ...next[idx + 1], origin: airport.code };
                        }
                        return next;
                      });
                      setTopActiveMultiCityDropdown(null);

                      // Auto-flow Step 3: Focus date input for this leg
                      setTimeout(() => {
                        const targetDateInput = topMultiCityDateRefs.current[idx];
                        if (targetDateInput) {
                          targetDateInput.focus();
                          if (typeof (targetDateInput as any).showPicker === "function") {
                            (targetDateInput as any).showPicker();
                          }
                        }
                      }, 150);
                    }}
                    selectedCode={leg.destination}
                    label={`Leg ${idx + 1} Destination`}
                  />
                </div>

                {/* Leg Date */}
                <div className="flex-1 w-full relative flex items-center bg-gray-50 rounded-xl border border-gray-200 h-12">
                  <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
                  <input
                    ref={(el) => { topMultiCityDateRefs.current[idx] = el; }}
                    type="date"
                    value={leg.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      setLegs((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], date: dateVal };
                        return next;
                      });
                      // Auto-flow: Open next leg destination OR open full Travellers popover for current leg
                      setTimeout(() => {
                        setTopActiveTravellerPopup(idx);
                      }, 150);
                    }}
                    className="w-full bg-transparent h-full pl-9 pr-3 text-xs font-bold outline-none text-midnight-navy cursor-pointer"
                  />
                </div>

                {/* Leg Travellers Display Button (triggers same Kayak popover) */}
                <div className="flex-1 w-full relative">
                  <button
                    type="button"
                    onClick={() => {
                      setTopActiveTravellerPopup(topActiveTravellerPopup === idx ? null : idx);
                      setTopActiveMultiCityDropdown(null);
                    }}
                    className="w-full flex items-center justify-between gap-2 bg-gray-50 rounded-xl border border-gray-200 h-12 px-3 hover:border-gold transition-colors text-xs font-bold text-midnight-navy"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{travellersLabel}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${topActiveTravellerPopup === idx ? "rotate-180" : ""}`} />
                  </button>

                  {topActiveTravellerPopup === idx && renderTravellersPopoverContent(() => {
                    setTopActiveTravellerPopup(null);
                    setTimeout(() => {
                      if (idx + 1 < legs.length) {
                        setTopActiveMultiCityDropdown({ legIdx: idx + 1, field: "destination" });
                      }
                    }, 150);
                  })}
                </div>

                {/* Remove Leg */}
                {legs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeLeg(idx)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Bottom Actions for Multi-City */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={addLeg}
                  disabled={legs.length >= 4}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Leg ({legs.length}/4)</span>
                </button>
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="btn-gold h-12 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-gold/20 font-bold text-sm w-full sm:w-auto shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search Multi-City</span>
              </button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
