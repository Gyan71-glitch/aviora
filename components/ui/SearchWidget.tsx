"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Building, Compass, Camera, Car, Calendar, Users, Search,
  MapPin, Train, Bus, FileText, Anchor, CreditCard, ShieldCheck,
  ArrowRightLeft, Plus, Minus, X, Trash2, ChevronDown
} from "lucide-react";
import AirportSelectorModal, { AirportItem } from "@/components/flights/AirportSelectorModal";
import FareTypeSelector, { FareType } from "@/components/flights/FareTypeSelector";

const TABS = [
  { id: "flights", label: "Flights", icon: Plane, route: "/flights" },
  { id: "hotels", label: "Hotels", icon: Building, route: "/hotels" },
  { id: "forex", label: "Forex", icon: CreditCard, route: "https://forexxmate.netlify.app/" },
  { id: "holidays", label: "Holiday Packages", icon: Compass, route: "/holidays" },
  { id: "trains", label: "Trains", icon: Train, route: "/trains" },
  { id: "buses", label: "Buses", icon: Bus, route: "/buses" },
  { id: "transfers", label: "Cabs", icon: Car, route: "/transfers" },
  { id: "sightseeing", label: "Tours & Attractions", icon: Camera, route: "/sightseeing" },
  { id: "visa", label: "Visa", icon: FileText, route: "/visa" },
  { id: "cruise", label: "Cruises", icon: Anchor, route: "/cruise" },
  { id: "insurance", label: "Insurance", icon: ShieldCheck, route: "/insurance" },
];

const AIRPORTS = [
  { code: "DEL", city: "New Delhi", country: "India", airport: "Indira Gandhi Intl Airport" },
  { code: "BOM", city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj Intl" },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", airport: "Dubai International Airport" },
  { code: "BLR", city: "Bengaluru", country: "India", airport: "Kempegowda International Airport" },
  { code: "GOI", city: "Goa", country: "India", airport: "Dabolim & Manohar Intl Airport" },
  { code: "SIN", city: "Singapore", country: "Singapore", airport: "Changi Airport" },
  { code: "BKK", city: "Bangkok", country: "Thailand", airport: "Suvarnabhumi / Don Mueang" },
  { code: "DPS", city: "Denpasar, Bali", country: "Indonesia", airport: "Ngurah Rai International" },
  { code: "LHR", city: "London", country: "United Kingdom", airport: "Heathrow Airport" },
  { code: "CDG", city: "Paris", country: "France", airport: "Charles de Gaulle Airport" },
  { code: "JFK", city: "New York", country: "United States", airport: "John F. Kennedy Intl" },
  { code: "HYD", city: "Hyderabad", country: "India", airport: "Rajiv Gandhi International" },
  { code: "CCU", city: "Kolkata", country: "India", airport: "Netaji Subhash Chandra Bose Intl" },
  { code: "MAA", city: "Chennai", country: "India", airport: "Chennai International Airport" },
];

const POPULAR_HOTEL_CITIES = [
  { city: "Shimla", country: "India" },
  { city: "Goa", country: "India" },
  { city: "New Delhi", country: "India" },
  { city: "Mumbai", country: "India" },
  { city: "Bengaluru", country: "India" },
  { city: "Manali", country: "India" },
  { city: "Udaipur", country: "India" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Singapore", country: "Singapore" },
  { city: "London", country: "United Kingdom" },
  { city: "New York", country: "United States" },
];

interface SearchWidgetProps {
  initialTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function SearchWidget({ initialTab = "flights", onTabChange }: SearchWidgetProps = {}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Flight Trip Type State (one_way | return | multi_city)
  const [flightTripType, setFlightTripType] = useState<"one_way" | "return" | "multi_city">("one_way");

  // Flight search states
  const [fromValue, setFromValue] = useState("New Delhi (DEL)");
  const [toValue, setToValue] = useState("Mumbai (BOM)");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const departDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);

  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  // Dates state
  const [departDate, setDepartDate] = useState("2026-10-15");
  const [returnDate, setReturnDate] = useState("2026-10-22");

  // Multi-City Legs state for Homepage (with separate per-leg travellers & cabin)
  const [homeLegs, setHomeLegs] = useState<
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
  >([
    {
      origin: "DEL",
      destination: "BOM",
      date: "2026-10-15",
      adults: 1,
      children: 0,
      infants: 0,
      childAges: [],
      cabin: "Economy",
    },
    {
      origin: "BOM",
      destination: "BLR",
      date: "2026-10-18",
      adults: 1,
      children: 0,
      infants: 0,
      childAges: [],
      cabin: "Economy",
    },
  ]);
  const [activeMultiCityDropdown, setActiveMultiCityDropdown] = useState<{ legIdx: number; field: "origin" | "destination" } | null>(null);
  const [activeLegTravellersIdx, setActiveLegTravellersIdx] = useState<number | null>(null);
  const multiCityDateRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Kayak-style Travellers & Cabin Class states
  const [activeTravellerPopup, setActiveTravellerPopup] = useState<"one_way_return" | number | "multi_city_bottom" | null>(null);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childAges, setChildAges] = useState<string[]>([]);
  const [infantsCount, setInfantsCount] = useState(0);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business" | "First">("Economy");

  const totalTravellers = adults + childrenCount + infantsCount;
  const travellersLabel = `${totalTravellers} ${totalTravellers === 1 ? "traveller" : "travellers"}, ${cabinClass}`;

  // Dedicated MakeMyTrip-Style Hotel Search States
  const [hotelType, setHotelType] = useState<"upto4" | "group">("upto4");
  const [hotelCity, setHotelCity] = useState("Shimla, India");
  const [hotelCheckIn, setHotelCheckIn] = useState("2026-08-07");
  const [hotelCheckOut, setHotelCheckOut] = useState("2026-08-08");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelPriceCategory, setHotelPriceCategory] = useState("₹0-₹1500, ₹1500-₹2500");

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState("");
  const [showRoomsPopover, setShowRoomsPopover] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const hotelCheckInRef = useRef<HTMLInputElement>(null);
  const hotelCheckOutRef = useRef<HTMLInputElement>(null);
  const hotelWidgetCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCityDropdown || showRoomsPopover || showPriceDropdown) {
      const timer = setTimeout(() => {
        if (hotelWidgetCardRef.current) {
          const rect = hotelWidgetCardRef.current.getBoundingClientRect();
          const dropdownEstimatedHeight = 320;
          const spaceBelow = window.innerHeight - rect.bottom;
          
          if (spaceBelow < dropdownEstimatedHeight) {
            const scrollAmount = dropdownEstimatedHeight - spaceBelow + 40;
            window.scrollBy({ top: scrollAmount, behavior: "smooth" });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showCityDropdown, showRoomsPopover, showPriceDropdown]);

  const formatMMTDate = (dateStr: string) => {
    if (!dateStr) return { dayNum: "7", monthYr: "Aug'26", weekday: "Friday" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { dayNum: "7", monthYr: "Aug'26", weekday: "Friday" };
    const dayNum = d.getDate().toString();
    const monthName = d.toLocaleString("en-US", { month: "short" });
    const yearShort = d.getFullYear().toString().slice(-2);
    const weekday = d.toLocaleString("en-US", { weekday: "long" });
    return { dayNum, monthYr: `${monthName}'${yearShort}`, weekday };
  };

  const hotelCheckInFormatted = formatMMTDate(hotelCheckIn);
  const hotelCheckOutFormatted = formatMMTDate(hotelCheckOut);

  const [holidayDestination, setHolidayDestination] = useState("");
  const [holidayCategory, setHolidayCategory] = useState("");
  const [transferPickup, setTransferPickup] = useState("");
  const [transferDropoff, setTransferDropoff] = useState("");

  const handleSwapAirports = () => {
    const temp = fromValue;
    setFromValue(toValue);
    setToValue(temp);
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

  const addHomeLeg = () => {
    if (homeLegs.length >= 4) return;
    const lastLeg = homeLegs[homeLegs.length - 1];
    const newIdx = homeLegs.length;
    const newOrigin = lastLeg ? lastLeg.destination : "BLR";
    setHomeLegs([
      ...homeLegs,
      {
        origin: newOrigin,
        destination: "DEL",
        date: "2026-10-22",
        adults: 1,
        children: 0,
        infants: 0,
        childAges: [],
        cabin: "Economy",
      },
    ]);
    setTimeout(() => {
      setActiveMultiCityDropdown({ legIdx: newIdx, field: "destination" });
    }, 150);
  };

  const removeHomeLeg = (idx: number) => {
    if (homeLegs.length <= 2) return;
    setHomeLegs(homeLegs.filter((_, i) => i !== idx));
  };

  const updateHomeLeg = (idx: number, field: string, value: string) => {
    const next = [...homeLegs];
    next[idx] = { ...next[idx], [field]: value };
    setHomeLegs(next);
  };

  const handleGenericSearch = (e: React.FormEvent, route: string) => {
    e.preventDefault();
    if (route.startsWith("http")) {
      window.open(route, "_blank", "noopener,noreferrer");
    } else {
      router.push(route);
    }
  };

  const [fareType, setFareType] = useState<FareType>("regular");
  const [priceDropProtection, setPriceDropProtection] = useState<boolean>(false);

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      tripType: flightTripType,
      from: fromValue,
      to: toValue,
      date: departDate,
      adults: adults.toString(),
      children: childrenCount.toString(),
      infants: infantsCount.toString(),
      childAges: JSON.stringify(childAges),
      cabin: cabinClass,
      fareType,
      priceDropProtection: priceDropProtection.toString(),
    });

    if (flightTripType === "return") {
      queryParams.set("returnDate", returnDate);
    } else if (flightTripType === "multi_city") {
      queryParams.set("legs", JSON.stringify(homeLegs));
    }

    router.push(`/flights?${queryParams.toString()}`);
  };

  const filteredFromAirports = AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(fromFilter.toLowerCase()) ||
      a.code.toLowerCase().includes(fromFilter.toLowerCase()) ||
      a.country.toLowerCase().includes(fromFilter.toLowerCase()) ||
      a.airport.toLowerCase().includes(fromFilter.toLowerCase())
  );

  const filteredToAirports = AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(toFilter.toLowerCase()) ||
      a.code.toLowerCase().includes(toFilter.toLowerCase()) ||
      a.country.toLowerCase().includes(toFilter.toLowerCase()) ||
      a.airport.toLowerCase().includes(toFilter.toLowerCase())
  );

  const renderTravellersPopoverContent = (onClose: () => void) => {
    return (
      <div className="absolute right-0 top-full mt-2 w-full md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-6 space-y-6 text-left">
        {/* Travellers Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Travellers</h4>

          {/* Adults */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800">Adults</span>{" "}
              <span className="text-[11px] text-slate-400 font-medium">18+</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-slate-900 w-4 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(9, adults + 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800">Children</span>{" "}
              <span className="text-[11px] text-slate-400 font-medium">0-17</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(Math.max(0, childrenCount - 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-slate-900 w-4 text-center">{childrenCount}</span>
              <button
                type="button"
                onClick={() => handleChildrenChange(Math.min(6, childrenCount + 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Child's age Selectors */}
          {childrenCount > 0 && (
            <div className="py-3 space-y-2 border-b border-slate-100">
              {childAges.map((age, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Child {idx + 1}&apos;s age</span>
                  <select
                    value={age}
                    onChange={(e) => updateChildAge(idx, e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-gold cursor-pointer shadow-sm"
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
              <span className="text-xs font-bold text-slate-800">Infants on lap</span>{" "}
              <span className="text-[11px] text-slate-400 font-medium">under 2</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold font-mono text-slate-900 w-4 text-center">{infantsCount}</span>
              <button
                type="button"
                onClick={() => setInfantsCount(Math.min(adults, infantsCount + 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cabin Class Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Cabin class</h4>
          <div className="grid grid-cols-2 gap-2">
            {(["Economy", "Premium Economy", "Business", "First"] as const).map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setCabinClass(cls)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  cabinClass === cls
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
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
    <motion.div
      id="search-widget"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl mx-auto z-10 relative px-2 scroll-mt-28"
    >
      {/* Vertical Service Tabs */}
      <div className="w-full flex justify-center mb-6 px-2">
        <div className="flex items-center gap-2 p-2 rounded-full bg-white/20 backdrop-blur-2xl border border-white/40 shadow-2xl overflow-x-auto no-scrollbar max-w-full px-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`relative px-4 py-2.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive ? "text-midnight-navy font-bold shadow-md" : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-midnight-navy" : "text-white/90"}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Box */}
      <div className="bg-white/95 backdrop-blur-2xl p-5 md:p-6 rounded-3xl border border-white/60 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent pointer-events-none rounded-t-3xl" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {/* FLIGHTS TAB */}
            {activeTab === "flights" && (
              <form onSubmit={handleFlightSearch} className="flex flex-col gap-4">
                
                {/* Flight Trip Type Pill Selector Buttons */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start">
                  {(
                    [
                      { id: "one_way", label: "One-Way" },
                      { id: "return", label: "Return (Round Trip)" },
                      { id: "multi_city", label: "Multi-City" },
                    ] as const
                  ).map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFlightTripType(type.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        flightTripType === type.id
                          ? "bg-midnight-navy text-white shadow-md"
                          : "text-slate-700 hover:bg-white hover:text-midnight-navy"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* ── 1-WAY & RETURN FLIGHT FORM ───────────────────────────── */}
                {flightTripType !== "multi_city" && (
                  <div className="flex flex-col xl:flex-row items-center gap-2 w-full">
                    
                    {/* FROM Airport Dropdown */}
                    <div className="flex-1 w-full relative">
                      <div
                        onClick={() => {
                          setShowFromDropdown(!showFromDropdown);
                          setShowToDropdown(false);
                          setActiveTravellerPopup(null);
                        }}
                        className="aviora-input pl-11 pr-4 h-14 font-semibold text-slate-800 flex items-center cursor-pointer border border-slate-200 hover:border-gold transition-all rounded-2xl bg-white shadow-sm"
                      >
                        <Plane className="absolute left-4 w-4 h-4 text-slate-400" />
                        <span className="truncate">{fromValue}</span>
                      </div>

                      <AirportSelectorModal
                        isOpen={showFromDropdown}
                        onClose={() => setShowFromDropdown(false)}
                        onSelect={(airport) => {
                          setFromValue(`${airport.city} (${airport.code})`);
                          setShowFromDropdown(false);
                          // Auto-flow Step 2: Open TO Airport Selector
                          setTimeout(() => {
                            setShowToDropdown(true);
                          }, 150);
                        }}
                        selectedCode={fromValue}
                        label="Origin (From)"
                      />
                    </div>

                    {/* Swap Button */}
                    <button
                      type="button"
                      onClick={handleSwapAirports}
                      title="Swap Airports"
                      className="p-3 rounded-full bg-slate-100 border border-slate-200 hover:border-gold hover:bg-amber-50 transition-all text-slate-700 hover:text-gold-dark shadow-sm shrink-0"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>

                    {/* TO Airport Dropdown */}
                    <div className="flex-1 w-full relative">
                      <div
                        onClick={() => {
                          setShowToDropdown(!showToDropdown);
                          setShowFromDropdown(false);
                          setActiveTravellerPopup(null);
                        }}
                        className="aviora-input pl-11 pr-4 h-14 font-semibold text-slate-800 flex items-center cursor-pointer border border-slate-200 hover:border-gold transition-all rounded-2xl bg-white shadow-sm"
                      >
                        <MapPin className="absolute left-4 w-4 h-4 text-slate-400" />
                        <span className="truncate">{toValue}</span>
                      </div>

                      <AirportSelectorModal
                        isOpen={showToDropdown}
                        onClose={() => setShowToDropdown(false)}
                        onSelect={(airport) => {
                          setToValue(`${airport.city} (${airport.code})`);
                          setShowToDropdown(false);
                          // Auto-flow Step 3: Open/Focus Departure Date
                          setTimeout(() => {
                            if (departDateRef.current) {
                              departDateRef.current.focus();
                              if (typeof (departDateRef.current as any).showPicker === "function") {
                                (departDateRef.current as any).showPicker();
                              }
                            }
                          }, 150);
                        }}
                        selectedCode={toValue}
                        label="Destination (To)"
                      />
                    </div>

                    {/* Departure Date */}
                    <div className="flex-1 w-full relative">
                      <div className="aviora-input pl-11 pr-4 h-14 font-semibold text-slate-800 flex items-center border border-slate-200 hover:border-gold transition-all rounded-2xl bg-white shadow-sm">
                        <Calendar className="absolute left-4 w-4 h-4 text-slate-400" />
                        <input
                          ref={departDateRef}
                          type="date"
                          value={departDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setDepartDate(e.target.value);
                             // Auto-flow Step 4: Go to Return Date or Travellers
                             setTimeout(() => {
                               if (flightTripType === "return" && returnDateRef.current) {
                                 returnDateRef.current.focus();
                                 if (typeof (returnDateRef.current as any).showPicker === "function") {
                                   (returnDateRef.current as any).showPicker();
                                 }
                               } else {
                                 setActiveTravellerPopup("one_way_return");
                               }
                             }, 150);
                           }}
                           className="w-full bg-transparent h-full border-none outline-none font-bold text-xs cursor-pointer text-slate-800"
                         />
                       </div>
                     </div>
 
                     {/* Return Date (Visible when Return tab selected) */}
                     {flightTripType === "return" && (
                       <div className="flex-1 w-full relative">
                         <div className="aviora-input pl-11 pr-4 h-14 font-semibold text-amber-950 flex items-center border border-amber-300 bg-amber-50/70 hover:border-gold transition-all rounded-2xl shadow-sm">
                           <Calendar className="absolute left-4 w-4 h-4 text-amber-700" />
                           <input
                             ref={returnDateRef}
                             type="date"
                             value={returnDate}
                             min={departDate}
                             onChange={(e) => {
                               setReturnDate(e.target.value);
                               // Auto-flow Step 5: Open Travellers Popover
                               setTimeout(() => {
                                 setActiveTravellerPopup("one_way_return");
                               }, 150);
                             }}
                             className="w-full bg-transparent h-full border-none outline-none font-bold text-xs cursor-pointer text-amber-950"
                           />
                         </div>
                       </div>
                     )}
 
                     {/* KAYAK-STYLE TRAVELLERS & CABIN CLASS POPOVER */}
                     <div className="flex-1 w-full relative">
                        <div
                          onClick={() => {
                            setActiveTravellerPopup(activeTravellerPopup === "one_way_return" ? null : "one_way_return");
                            setShowFromDropdown(false);
                            setShowToDropdown(false);
                          }}
                          className="aviora-input pl-11 pr-4 h-14 font-semibold text-slate-800 flex items-center justify-between cursor-pointer border border-slate-200 hover:border-gold transition-all rounded-2xl bg-white shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Users className="absolute left-4 w-4 h-4 text-slate-400" />
                            <span className="truncate text-xs font-bold text-midnight-navy ml-2">{travellersLabel}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${activeTravellerPopup === "one_way_return" ? "rotate-180" : ""}`} />
                        </div>

                        {activeTravellerPopup === "one_way_return" && renderTravellersPopoverContent(() => {
                          setActiveTravellerPopup(null);
                        })}
                      </div>

                    {/* Search Button */}
                    <button
                      type="submit"
                      className="btn-gold h-14 px-6 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap group shadow-lg shadow-gold/20 font-bold shrink-0 w-full xl:w-auto"
                    >
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Search Flights</span>
                    </button>

                  </div>
                )}

                {/* ── MAKE MY TRIP FARE TYPE SELECTION ROW ───────────────── */}
                <div className="mt-3 border-t border-slate-200/80 pt-2">
                  <FareTypeSelector
                    fareType={fareType}
                    onChangeFareType={setFareType}
                    priceDropProtection={priceDropProtection}
                    onChangePriceDropProtection={setPriceDropProtection}
                  />
                </div>

                {/* ── MULTI-CITY FLIGHT FORM ON HOMEPAGE ─────────────────── */}
                {flightTripType === "multi_city" && (
                  <div className="flex flex-col gap-3 w-full bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
                    {homeLegs.map((leg, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center gap-3">
                        <span className="text-xs font-bold font-mono text-slate-600 w-14 shrink-0">
                          Leg {idx + 1}:
                        </span>

                        {/* Leg From */}
                        <div className="flex-1 w-full relative">
                          <div
                            onClick={() =>
                              setActiveMultiCityDropdown(
                                activeMultiCityDropdown?.legIdx === idx && activeMultiCityDropdown?.field === "origin"
                                  ? null
                                  : { legIdx: idx, field: "origin" }
                              )
                            }
                            className="flex items-center bg-white rounded-xl border border-slate-200 h-12 px-3 cursor-pointer hover:border-gold transition-colors"
                          >
                            <MapPin className="text-slate-400 w-4 h-4 mr-2 shrink-0" />
                            <span className="text-xs font-bold text-slate-800 truncate">{leg.origin}</span>
                          </div>

                          <AirportSelectorModal
                            isOpen={activeMultiCityDropdown?.legIdx === idx && activeMultiCityDropdown?.field === "origin"}
                            onClose={() => setActiveMultiCityDropdown(null)}
                            onSelect={(airport) => {
                              updateHomeLeg(idx, "origin", `${airport.city} (${airport.code})`);
                              setActiveMultiCityDropdown(null);
                              // Auto-flow Step 2: Open Leg destination
                              setTimeout(() => {
                                setActiveMultiCityDropdown({ legIdx: idx, field: "destination" });
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
                              setActiveMultiCityDropdown(
                                activeMultiCityDropdown?.legIdx === idx && activeMultiCityDropdown?.field === "destination"
                                  ? null
                                  : { legIdx: idx, field: "destination" }
                              )
                            }
                            className="flex items-center bg-white rounded-xl border border-slate-200 h-12 px-3 cursor-pointer hover:border-gold transition-colors"
                          >
                            <MapPin className="text-slate-400 w-4 h-4 mr-2 shrink-0" />
                            <span className="text-xs font-bold text-slate-800 truncate">{leg.destination}</span>
                          </div>

                          <AirportSelectorModal
                            isOpen={activeMultiCityDropdown?.legIdx === idx && activeMultiCityDropdown?.field === "destination"}
                            onClose={() => setActiveMultiCityDropdown(null)}
                            onSelect={(airport) => {
                              const destVal = `${airport.city} (${airport.code})`;
                              setHomeLegs((prev) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], destination: destVal };
                                if (idx + 1 < next.length) {
                                  next[idx + 1] = { ...next[idx + 1], origin: destVal };
                                }
                                return next;
                              });
                              setActiveMultiCityDropdown(null);

                              // Auto-flow Step 3: Focus date input for this leg
                              setTimeout(() => {
                                const targetDateInput = multiCityDateRefs.current[idx];
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
                        <div className="flex-1 w-full relative flex items-center bg-white rounded-xl border border-slate-200 h-12">
                          <Calendar className="absolute left-3 text-slate-400 w-4 h-4" />
                          <input
                            ref={(el) => { multiCityDateRefs.current[idx] = el; }}
                            type="date"
                            value={leg.date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              const dateVal = e.target.value;
                              setHomeLegs((prev) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], date: dateVal };
                                return next;
                              });
                              // Auto-flow: Open next leg destination OR open full Travellers popover for current leg
                              setTimeout(() => {
                                setActiveTravellerPopup(idx);
                              }, 150);
                            }}
                            className="w-full bg-transparent h-full pl-9 pr-3 text-xs font-bold outline-none text-slate-800 cursor-pointer"
                          />
                        </div>

                        {/* Leg Travellers Display Button (triggers same Kayak popover) */}
                        <div className="flex-1 w-full relative">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTravellerPopup(activeTravellerPopup === idx ? null : idx);
                              setActiveMultiCityDropdown(null);
                            }}
                            className="w-full flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 h-12 px-3 hover:border-gold transition-colors text-xs font-bold text-slate-800"
                          >
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{travellersLabel}</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${activeTravellerPopup === idx ? "rotate-180" : ""}`} />
                          </button>

                          {activeTravellerPopup === idx && renderTravellersPopoverContent(() => {
                            setActiveTravellerPopup(null);
                            setTimeout(() => {
                              if (idx + 1 < homeLegs.length) {
                                setActiveMultiCityDropdown({ legIdx: idx + 1, field: "destination" });
                              }
                            }, 150);
                          })}
                        </div>

                        {/* Remove Leg Button */}
                        {homeLegs.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeHomeLeg(idx)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={addHomeLeg}
                          disabled={homeLegs.length >= 4}
                          className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 border border-amber-200 hover:bg-amber-100 px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Leg ({homeLegs.length}/4)</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="btn-gold h-12 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-gold/20 font-bold text-sm w-full sm:w-auto shrink-0"
                      >
                        <Search className="w-4 h-4" />
                        <span>Search Multi-City Flights</span>
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

            {/* HOTELS TAB - MAKEMYTRIP STYLE ENGINE */}
            {activeTab === "hotels" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  let minP = 0;
                  let maxP = 200000;
                  if (hotelPriceCategory.includes("₹0-₹1500")) { minP = 0; maxP = 1500; }
                  else if (hotelPriceCategory.includes("₹1500-₹2500")) { minP = 1500; maxP = 2500; }
                  else if (hotelPriceCategory.includes("₹2500-₹5000")) { minP = 2500; maxP = 5000; }
                  else if (hotelPriceCategory.includes("₹5000+")) { minP = 5000; maxP = 200000; }

                  router.push(
                    `/hotels?destination=${encodeURIComponent(hotelCity)}&checkIn=${hotelCheckIn}&checkOut=${hotelCheckOut}&rooms=${hotelRooms}&adults=${hotelAdults}&children=${hotelChildren}&minPrice=${minP}&maxPrice=${maxP}`
                  );
                }}
                className="w-full text-left"
              >
                {/* 1. Sub-header radio options */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="hotelType"
                        checked={hotelType === "upto4"}
                        onChange={() => setHotelType("upto4")}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="font-extrabold text-slate-900">Upto 4 Rooms</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="hotelType"
                        checked={hotelType === "group"}
                        onChange={() => setHotelType("group")}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        Group Deals <span className="bg-pink-100 text-pink-700 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">new</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* 2. Main 4-Column Inputs Grid */}
                <div ref={hotelWidgetCardRef} className="grid grid-cols-1 md:grid-cols-4 border border-slate-200/90 rounded-2xl bg-white shadow-sm divide-y md:divide-y-0 md:divide-x divide-slate-200">

                  {/* COL 1: CITY, PROPERTY NAME OR LOCATION */}
                  <div
                    className="p-4 flex flex-col justify-center cursor-pointer hover:bg-blue-50/40 transition-colors relative group rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown);
                      setShowRoomsPopover(false);
                      setShowPriceDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <span>City, Property Name Or Location</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1 truncate tracking-tight">
                      {hotelCity.split(",")[0]}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                      {hotelCity.includes(",") ? hotelCity.split(",")[1].trim() : "India"}
                    </div>

                    {/* City Dropdown Modal (Ultra Luxury Glassmorphic & Next-Step Automation) */}
                    {showCityDropdown && (
                      <div
                        className="absolute top-full left-0 mt-2 w-84 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-amber-500/30 p-5 z-50 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Select Destination
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Step 1 of 5</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Search city, luxury resort or location..."
                          value={citySearchInput}
                          onChange={(e) => setCitySearchInput(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none border border-slate-200/80 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 mb-3 shadow-inner transition-all"
                          autoFocus
                        />
                        <div className="max-h-64 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                          {POPULAR_HOTEL_CITIES.filter(
                            (c) =>
                              c.city.toLowerCase().includes(citySearchInput.toLowerCase()) ||
                              c.country.toLowerCase().includes(citySearchInput.toLowerCase())
                          ).map((c) => (
                            <button
                              key={c.city}
                              type="button"
                              onClick={() => {
                                setHotelCity(`${c.city}, ${c.country}`);
                                setShowCityDropdown(false);
                                // AUTOMATION STEP 1 -> STEP 2 (Auto Open Check-In)
                                setTimeout(() => {
                                  if (hotelCheckInRef.current && typeof (hotelCheckInRef.current as any).showPicker === "function") {
                                    (hotelCheckInRef.current as any).showPicker();
                                  } else {
                                    hotelCheckInRef.current?.focus();
                                  }
                                }, 200);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gradient-to-r hover:from-amber-50/80 hover:to-blue-50/50 border border-transparent hover:border-amber-200/60 text-left transition-all duration-200 group/city"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold group-hover/city:bg-amber-500 group-hover/city:text-white transition-colors">
                                  <Building className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="text-xs font-black text-slate-900 group-hover/city:text-amber-900 transition-colors">{c.city}</div>
                                  <div className="text-[10px] font-bold text-slate-400">{c.country}</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-black text-amber-700 uppercase bg-amber-100/80 px-2.5 py-0.5 rounded-full tracking-wider group-hover/city:bg-amber-500 group-hover/city:text-white transition-colors shadow-xs">
                                Popular
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COL 2: CHECK-IN & CHECK-OUT DATES */}
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    {/* Check-In */}
                    <div
                      className="p-4 flex flex-col justify-center cursor-pointer hover:bg-blue-50/40 transition-colors relative group"
                      onClick={() => {
                        if (hotelCheckInRef.current && typeof (hotelCheckInRef.current as any).showPicker === "function") {
                          (hotelCheckInRef.current as any).showPicker();
                        } else {
                          hotelCheckInRef.current?.focus();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Check-In</span>
                        <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                        <span>{hotelCheckInFormatted.dayNum}</span>
                        <span className="text-xs font-bold text-slate-700">{hotelCheckInFormatted.monthYr}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {hotelCheckInFormatted.weekday}
                      </div>
                      <input
                        ref={hotelCheckInRef}
                        type="date"
                        value={hotelCheckIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setHotelCheckIn(e.target.value);
                          // AUTOMATION STEP 2 -> STEP 3 (Auto Open Check-Out)
                          setTimeout(() => {
                            if (hotelCheckOutRef.current && typeof (hotelCheckOutRef.current as any).showPicker === "function") {
                              (hotelCheckOutRef.current as any).showPicker();
                            } else {
                              hotelCheckOutRef.current?.focus();
                            }
                          }, 250);
                        }}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer pointer-events-none"
                      />
                    </div>

                    {/* Check-Out */}
                    <div
                      className="p-4 flex flex-col justify-center cursor-pointer hover:bg-blue-50/40 transition-colors relative group"
                      onClick={() => {
                        if (hotelCheckOutRef.current && typeof (hotelCheckOutRef.current as any).showPicker === "function") {
                          (hotelCheckOutRef.current as any).showPicker();
                        } else {
                          hotelCheckOutRef.current?.focus();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Check-Out</span>
                        <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                        <span>{hotelCheckOutFormatted.dayNum}</span>
                        <span className="text-xs font-bold text-slate-700">{hotelCheckOutFormatted.monthYr}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {hotelCheckOutFormatted.weekday}
                      </div>
                      <input
                        ref={hotelCheckOutRef}
                        type="date"
                        value={hotelCheckOut}
                        min={hotelCheckIn}
                        onChange={(e) => {
                          setHotelCheckOut(e.target.value);
                          // AUTOMATION STEP 3 -> STEP 4 (Auto Open Rooms & Guests Popover)
                          setTimeout(() => {
                            setShowRoomsPopover(true);
                            setShowCityDropdown(false);
                            setShowPriceDropdown(false);
                          }, 250);
                        }}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* COL 3: ROOMS & GUESTS */}
                  <div
                    className={`p-4 flex flex-col justify-center cursor-pointer transition-colors relative group ${
                      showRoomsPopover ? "bg-[#f2f8ff]" : "hover:bg-blue-50/40"
                    }`}
                    onClick={() => {
                      setShowRoomsPopover(!showRoomsPopover);
                      setShowCityDropdown(false);
                      setShowPriceDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Rooms & Guests</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform ${showRoomsPopover ? "rotate-180" : ""}`} />
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1 truncate">
                      {hotelRooms} <span className="text-xs font-bold text-slate-700">Rooms</span> {hotelAdults} <span className="text-xs font-bold text-slate-700">Adults</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {hotelChildren > 0 ? `${hotelChildren} Children` : "Standard Room"}
                    </div>

                    {/* Rooms & Guests Popover (Ultra Luxury Glassmorphic Design) */}
                    {showRoomsPopover && (
                      <div
                        className="absolute top-full right-0 mt-2 w-80 sm:w-[420px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-amber-500/30 p-6 z-50 text-left space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-500" /> Guests & Room Selection
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Step 4 of 5</span>
                        </div>

                        {/* Room */}
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <div className="text-sm font-black text-slate-900">Room</div>
                            <div className="text-[11px] text-slate-400 font-medium">Up to 4 Rooms per booking</div>
                          </div>
                          <div className="flex items-center gap-3 border border-slate-200/90 rounded-xl p-1 bg-slate-50/80 shadow-inner">
                            <button
                              type="button"
                              onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              −
                            </button>
                            <span className="text-sm font-black text-slate-900 w-5 text-center">{hotelRooms}</span>
                            <button
                              type="button"
                              onClick={() => setHotelRooms(Math.min(4, hotelRooms + 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Adults */}
                        <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
                          <div>
                            <div className="text-sm font-black text-slate-900">Adults</div>
                            <div className="text-[11px] text-slate-400 font-medium">12+ Years Old</div>
                          </div>
                          <div className="flex items-center gap-3 border border-slate-200/90 rounded-xl p-1 bg-slate-50/80 shadow-inner">
                            <button
                              type="button"
                              onClick={() => setHotelAdults(Math.max(1, hotelAdults - 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              −
                            </button>
                            <span className="text-sm font-black text-slate-900 w-5 text-center">{hotelAdults}</span>
                            <button
                              type="button"
                              onClick={() => setHotelAdults(Math.min(12, hotelAdults + 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
                          <div>
                            <div className="text-sm font-black text-slate-900">Children</div>
                            <div className="text-[11px] text-slate-400 font-medium">0 - 11 Years Old</div>
                          </div>
                          <div className="flex items-center gap-3 border border-slate-200/90 rounded-xl p-1 bg-slate-50/80 shadow-inner">
                            <button
                              type="button"
                              onClick={() => setHotelChildren(Math.max(0, hotelChildren - 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              −
                            </button>
                            <span className="text-sm font-black text-slate-900 w-5 text-center">{hotelChildren}</span>
                            <button
                              type="button"
                              onClick={() => setHotelChildren(Math.min(6, hotelChildren + 1))}
                              className="w-7 h-7 flex items-center justify-center font-black text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors text-base"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Pet Friendly Checkbox */}
                        <div className="bg-gradient-to-r from-amber-50/60 via-blue-50/40 to-amber-50/30 border border-amber-200/70 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-amber-600 mt-0.5 rounded cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-black text-slate-900 block">Travelling with Pets?</span>
                              <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">
                                Select to filter pet-friendly luxury stays & tailored amenities.
                              </span>
                            </div>
                          </label>
                          <span className="text-2xl shrink-0">🐾</span>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowRoomsPopover(false);
                              // AUTOMATION STEP 4 -> STEP 5 (Auto Open Price Per Night)
                              setTimeout(() => {
                                setShowPriceDropdown(true);
                                setShowCityDropdown(false);
                              }, 200);
                            }}
                            className="btn-gold shadow-lg shadow-amber-500/20 text-xs px-8 py-2.5 rounded-full font-black tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
                          >
                            APPLY & CONTINUE →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COL 4: PRICE PER NIGHT */}
                  <div
                    className={`p-4 flex flex-col justify-center cursor-pointer transition-colors relative group rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none ${
                      showPriceDropdown ? "bg-[#f2f8ff]" : "hover:bg-blue-50/40"
                    }`}
                    onClick={() => {
                      setShowPriceDropdown(!showPriceDropdown);
                      setShowCityDropdown(false);
                      setShowRoomsPopover(false);
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Price Per Night</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform ${showPriceDropdown ? "rotate-180" : ""}`} />
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                      {hotelPriceCategory}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      Select Budget
                    </div>

                    {/* Price Per Night Popover (Ultra Luxury Glassmorphism) */}
                    {showPriceDropdown && (
                      <div
                        className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-amber-500/30 p-4 z-50 text-left space-y-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1 px-1">
                          <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">
                            Select Nightly Budget
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Step 5 of 5</span>
                        </div>
                        {[
                          "₹0-₹1500",
                          "₹1500-₹2500",
                          "₹2500-₹5000",
                          "₹5000+",
                        ].map((range) => (
                          <button
                            key={range}
                            type="button"
                            onClick={() => {
                              setHotelPriceCategory(range);
                              setShowPriceDropdown(false);
                            }}
                            className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between ${
                              hotelPriceCategory === range
                                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20"
                                : "hover:bg-amber-50 hover:text-amber-900 text-slate-800"
                            }`}
                          >
                            <span>{range}</span>
                            {hotelPriceCategory === range && <span className="text-sm">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* 3. Trending Searches Row */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold text-[11px]">Trending Searches:</span>
                  {[
                    "New York, United States",
                    "London, United Kingdom",
                    "Bangkok, Thailand",
                    "Shimla, India",
                    "Goa, India",
                    "Dubai, UAE",
                  ].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setHotelCity(pill)}
                      className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors border border-slate-200/80 text-[11px]"
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                {/* 4. Centered Search Button */}
                <div className="relative mt-5 flex justify-center">
                  <button
                    type="submit"
                    className="btn-gold h-14 px-14 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-gold/20 font-extrabold text-base tracking-widest uppercase transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Search className="w-5 h-5" />
                    <span>SEARCH HOTELS</span>
                  </button>
                </div>
              </form>
            )}

            {/* HOLIDAYS TAB */}
            {activeTab === "holidays" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(
                    `/holidays?destination=${encodeURIComponent(holidayDestination)}&category=${encodeURIComponent(holidayCategory)}`
                  );
                }}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Destination / Country</label>
                  <div className="relative">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={holidayDestination}
                      onChange={(e) => setHolidayDestination(e.target.value)}
                      placeholder="Select destination (e.g. Haridwar, Shimla)..."
                      className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Holiday Type</label>
                  <div className="relative">
                    <select
                      value={holidayCategory}
                      onChange={(e) => setHolidayCategory(e.target.value)}
                      className="aviora-input px-4 h-14 font-medium text-slate-800 bg-white"
                    >
                      <option value="">All Categories</option>
                      <option value="romantic">Romantic & Honeymoon</option>
                      <option value="luxury">Ultra Luxury Escapes</option>
                      <option value="family">Family Vacations</option>
                      <option value="adventure">Wellness & Adventure</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Travel Month</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="October 2026" placeholder="Select month" className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800" />
                  </div>
                </div>
                <button type="submit" className="btn-gold h-14 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 group shadow-lg shadow-gold/20 font-bold">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Search Packages</span>
                </button>
              </form>
            )}

            {/* SIGHTSEEING TAB */}
            {activeTab === "sightseeing" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(`/sightseeing`);
                }}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">City or Landmark</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="E.g. Dubai, Paris, Singapore" className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Tour Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="16 Oct 2026" placeholder="Select date" className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Tickets / Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="2 Adult Passes" placeholder="Number of tickets" className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800" />
                  </div>
                </div>
                <button type="submit" className="btn-gold h-14 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 group shadow-lg shadow-gold/20 font-bold">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Explore Tours</span>
                </button>
              </form>
            )}

            {/* TRANSFERS TAB */}
            {activeTab === "transfers" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(
                    `/transfers?from=${encodeURIComponent(transferPickup)}&to=${encodeURIComponent(transferDropoff)}`
                  );
                }}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Pickup Location</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={transferPickup}
                      onChange={(e) => setTransferPickup(e.target.value)}
                      placeholder="Airport or Hotel (e.g. DXB, Airport)"
                      className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Dropoff Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={transferDropoff}
                      onChange={(e) => setTransferDropoff(e.target.value)}
                      placeholder="Destination address or Hotel"
                      className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">Pickup Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="15 Oct, 14:30" placeholder="Date & Time" className="aviora-input pl-11 pr-4 h-14 font-medium text-slate-800" />
                  </div>
                </div>
                <button type="submit" className="btn-gold h-14 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 group shadow-lg shadow-gold/20 font-bold">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Book Chauffeur</span>
                </button>
              </form>
            )}

            {/* OTHER VERTICAL TABS */}
            {["trains", "buses", "visa", "cruise", "forex", "insurance"].includes(activeTab) && (
              <form onSubmit={(e) => handleGenericSearch(e, TABS.find((t) => t.id === activeTab)?.route || "/")} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase ml-1">
                    {activeTab === "trains" && "From & To Stations"}
                    {activeTab === "buses" && "Route & Departure City"}
                    {activeTab === "visa" && "Destination Country"}
                    {activeTab === "cruise" && "Sailing Port or Cruise Line"}
                    {activeTab === "forex" && "Foreign Currency"}
                    {activeTab === "insurance" && "Travel Country"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={
                        activeTab === "trains" ? "Mumbai → Delhi (Rajdhani)" :
                        activeTab === "buses" ? "Delhi → Manali (Volvo AC)" :
                        activeTab === "visa" ? "Dubai (30-Day Express eVisa)" :
                        activeTab === "cruise" ? "Cordelia Cruise (Mumbai to Goa)" :
                        activeTab === "forex" ? "USD, EUR, AED Foreign Currency" :
                        "Worldwide Travel Shield ($50k)"
                      }
                      className="aviora-input px-4 h-14 font-medium text-slate-800"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-gold h-14 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 group shadow-lg shadow-gold/20 font-bold">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Search {TABS.find((t) => t.id === activeTab)?.label}</span>
                </button>
              </form>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
