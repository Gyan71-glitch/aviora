"use client";

import { useState } from "react";
import { Search, ChevronDown, Calendar, Users, MapPin, Building } from "lucide-react";

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

interface HotelSearchTopBarProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomsCount?: number;
  totalProperties?: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onSearchSubmit?: (params: { destination: string; checkIn: string; checkOut: string }) => void;
}

export default function HotelSearchTopBar({
  destination,
  checkIn,
  checkOut,
  guestsCount,
  roomsCount = 1,
  totalProperties = 150,
  sortBy,
  onSortChange,
  onSearchSubmit,
}: HotelSearchTopBarProps) {
  const [cityInput, setCityInput] = useState(destination);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState("");

  const cityName = (destination || "Shimla").split(",")[0];

  const sortOptions = [
    { id: "popularity", label: "Popularity" },
    { id: "price_asc", label: "Price (Low to High)" },
    { id: "price_desc", label: "Price (High to Low)" },
    { id: "rating", label: "User Rating (Highest)" },
    { id: "best_rated", label: "Lowest Price & Best Rated" },
  ];

  return (
    <>
      {/* 1. Solid Sticky Search Strip Header (Fixed at top-0 when scrolling down) */}
      <div className="sticky top-0 z-[100] bg-slate-50 py-3 border-b border-slate-200 shadow-md -mx-4 px-4 mb-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-2 flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full flex-1 relative">
            {/* City / Area */}
            <div className="relative">
              <div 
                className="bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200/60 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer flex flex-col justify-center text-left transition-colors h-full"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center justify-between">
                  <span>CITY, AREA OR PROPERTY</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="bg-transparent font-black text-slate-900 text-sm outline-none truncate mt-0.5">
                  {cityInput || "Where to?"}
                </span>
              </div>
              
              {/* City Dropdown Modal */}
              {showCityDropdown && (
                <div
                  className="absolute top-[105%] left-0 w-84 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-amber-500/30 p-5 z-[150] text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" /> Select Destination
                    </span>
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
                          setCityInput(`${c.city}, ${c.country}`);
                          setShowCityDropdown(false);
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

            {/* Check-In */}
            <div className="bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200/60 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer flex flex-col justify-center text-left transition-colors">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">CHECK-IN</span>
              <span className="font-black text-slate-900 text-sm truncate">{checkIn || "Fri, 7 Aug 2026"}</span>
            </div>

            {/* Check-Out */}
            <div className="bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200/60 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer flex flex-col justify-center text-left transition-colors">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">CHECK-OUT</span>
              <span className="font-black text-slate-900 text-sm truncate">{checkOut || "Sat, 8 Aug 2026"}</span>
            </div>

            {/* Rooms & Guests */}
            <div className="bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200/60 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer flex flex-col justify-center text-left transition-colors">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">ROOMS & GUESTS</span>
              <span className="font-black text-slate-900 text-sm truncate">{roomsCount} Room, {guestsCount} Guests</span>
            </div>
          </div>

          {/* SEARCH Button */}
          <button
            type="button"
            onClick={() => onSearchSubmit?.({ destination: cityInput, checkIn, checkOut })}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black px-8 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shrink-0 w-full md:w-auto"
          >
            SEARCH
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* 2. Property Count Banner */}
        <div className="text-left pt-2">
          <h2 className="font-black text-2xl text-slate-900 tracking-tight">
            {totalProperties} Properties in {cityName}
          </h2>
        </div>

        {/* 3. MakeMyTrip Horizontal Pill Sorting Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sortOptions.map((opt) => {
            const isActive = sortBy === opt.id || (sortBy === "popularity" && opt.id === "popularity");
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSortChange(opt.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 border ${
                  isActive
                    ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
