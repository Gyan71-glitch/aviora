"use client";

import { useState } from "react";
import { Star, Filter, RotateCcw, Search } from "lucide-react";
import { Hotel } from "@/lib/types";

export interface HotelSidebarFilters {
  searchQuery: string;
  selectedDeals: string[];
  selectedPriceRanges: string[];
  selectedStars: number[];
  minRating: number;
  selectedPropertyTypes: string[];
  selectedLocations: string[];
  selectedViews: string[];
  selectedRoomAmenities: string[];
  selectedChains: string[];
  selectedAmenities: string[];
  selectedRules: string[];
  flexibleTiming: string[];
}

interface HotelSidebarProps {
  hotels: Hotel[];
  onFilterChange: (filters: HotelSidebarFilters) => void;
}

export default function HotelSidebar({ hotels, onFilterChange }: HotelSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [flexibleTiming, setFlexibleTiming] = useState<string[]>([]);
  const [amenitySearch, setAmenitySearch] = useState("");

  const updateFilters = (newFilters: Partial<HotelSidebarFilters>) => {
    const updated: HotelSidebarFilters = {
      searchQuery: newFilters.searchQuery !== undefined ? newFilters.searchQuery : searchQuery,
      selectedDeals: newFilters.selectedDeals !== undefined ? newFilters.selectedDeals : selectedDeals,
      selectedPriceRanges: newFilters.selectedPriceRanges !== undefined ? newFilters.selectedPriceRanges : selectedPriceRanges,
      selectedStars: newFilters.selectedStars !== undefined ? newFilters.selectedStars : selectedStars,
      minRating: newFilters.minRating !== undefined ? newFilters.minRating : minRating,
      selectedPropertyTypes: newFilters.selectedPropertyTypes !== undefined ? newFilters.selectedPropertyTypes : selectedPropertyTypes,
      selectedLocations: newFilters.selectedLocations !== undefined ? newFilters.selectedLocations : selectedLocations,
      selectedViews: newFilters.selectedViews !== undefined ? newFilters.selectedViews : selectedViews,
      selectedRoomAmenities: newFilters.selectedRoomAmenities !== undefined ? newFilters.selectedRoomAmenities : selectedRoomAmenities,
      selectedChains: newFilters.selectedChains !== undefined ? newFilters.selectedChains : selectedChains,
      selectedAmenities: newFilters.selectedAmenities !== undefined ? newFilters.selectedAmenities : selectedAmenities,
      selectedRules: newFilters.selectedRules !== undefined ? newFilters.selectedRules : selectedRules,
      flexibleTiming: newFilters.flexibleTiming !== undefined ? newFilters.flexibleTiming : flexibleTiming,
    };
    onFilterChange(updated);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDeals([]);
    setSelectedPriceRanges([]);
    setSelectedStars([]);
    setMinRating(0);
    setSelectedPropertyTypes([]);
    setSelectedLocations([]);
    setSelectedViews([]);
    setSelectedRoomAmenities([]);
    setSelectedChains([]);
    setSelectedAmenities([]);
    setSelectedRules([]);
    setFlexibleTiming([]);
    setAmenitySearch("");
    onFilterChange({
      searchQuery: "",
      selectedDeals: [],
      selectedPriceRanges: [],
      selectedStars: [],
      minRating: 0,
      selectedPropertyTypes: [],
      selectedLocations: [],
      selectedViews: [],
      selectedRoomAmenities: [],
      selectedChains: [],
      selectedAmenities: [],
      selectedRules: [],
      flexibleTiming: [],
    });
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void, key: keyof HotelSidebarFilters) => {
    const next = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
    setter(next);
    updateFilters({ [key]: next });
  };

  const toggleStar = (star: number) => {
    const next = selectedStars.includes(star)
      ? selectedStars.filter((s) => s !== star)
      : [...selectedStars, star];
    setSelectedStars(next);
    updateFilters({ selectedStars: next });
  };

  // Compute exact real counts from active hotels list
  const getCount = (filterFn: (h: Hotel) => boolean) => hotels.filter(filterFn).length;

  const priceRanges = [
    { label: "₹ 0 - ₹ 1500", count: getCount((h) => h.pricePerNight <= 1500) },
    { label: "₹ 1500 - ₹ 2500", count: getCount((h) => h.pricePerNight >= 1500 && h.pricePerNight <= 2500) },
    { label: "₹ 2500 - ₹ 3500", count: getCount((h) => h.pricePerNight >= 2500 && h.pricePerNight <= 3500) },
    { label: "₹ 3500 - ₹ 5500", count: getCount((h) => h.pricePerNight >= 3500 && h.pricePerNight <= 5500) },
    { label: "₹ 5500 - ₹ 8000", count: getCount((h) => h.pricePerNight >= 5500 && h.pricePerNight <= 8000) },
    { label: "₹ 8000+", count: getCount((h) => h.pricePerNight >= 8000) },
  ];

  const dealsForYou = [
    { name: "Rush Deal", count: getCount((h) => !!h.featured) },
    { name: "Last Minute Deals", count: getCount((h) => h.pricePerNight < 4000) },
    { name: "Top Rated by Women Travellers", count: getCount((h) => h.rating >= 4.0) },
    { name: "Match Made in Heaven Sale", count: getCount((h) => h.rating >= 4.3) },
    { name: "OneCircle Rewards", count: hotels.length },
  ];

  const propertyTypes = [
    { name: "Hotel", count: getCount((h) => h.name.toLowerCase().includes("hotel") || !h.tags?.some((t) => ["resort", "villa", "homestay", "apartment"].includes(t.toLowerCase()))) },
    { name: "Resort", count: getCount((h) => h.name.toLowerCase().includes("resort") || h.tags?.some((t) => t.toLowerCase().includes("resort"))) },
    { name: "Villa", count: getCount((h) => h.name.toLowerCase().includes("villa") || h.tags?.some((t) => t.toLowerCase().includes("villa"))) },
    { name: "Homestay", count: getCount((h) => h.name.toLowerCase().includes("homestay") || h.tags?.some((t) => t.toLowerCase().includes("homestay"))) },
    { name: "Apartment", count: getCount((h) => h.name.toLowerCase().includes("apartment") || h.tags?.some((t) => t.toLowerCase().includes("apartment"))) },
  ];

  const rawLocations = Array.from(
    new Set(
      hotels
        .map((h) => h.location || h.address || "")
        .filter(Boolean)
        .map((loc) => loc.split(",")[0].trim())
    )
  ).slice(0, 10);

  const topLocations = rawLocations.length > 0 ? rawLocations : ["Mall Road", "The Mall", "Kachi Ghatti", "Lakkar Bazaar"];

  const roomViews = [
    { name: "Garden View", count: getCount((h) => h.description?.toLowerCase().includes("garden") || false) },
    { name: "Mountain View", count: getCount((h) => h.description?.toLowerCase().includes("mountain") || h.description?.toLowerCase().includes("valley") || false) },
    { name: "City View", count: getCount((h) => h.description?.toLowerCase().includes("city") || false) },
    { name: "Forest View", count: getCount((h) => h.description?.toLowerCase().includes("forest") || false) },
    { name: "Valley View", count: getCount((h) => h.description?.toLowerCase().includes("valley") || false) },
  ];

  const roomAmenities = [
    { name: "Fireplace", count: getCount((h) => h.description?.toLowerCase().includes("fireplace") || false) },
    { name: "Bathtub", count: getCount((h) => h.amenities.some((a) => a.toLowerCase().includes("bathtub"))) },
    { name: "Interconnected Room", count: getCount((h) => h.amenities.some((a) => a.toLowerCase().includes("room"))) },
    { name: "Smoking Room", count: getCount((h) => h.amenities.some((a) => a.toLowerCase().includes("smoking"))) },
  ];

  const chainsList = [
    { name: "Oberoi Hotels", count: getCount((h) => h.name.toLowerCase().includes("oberoi")) },
    { name: "Taj Hotels", count: getCount((h) => h.name.toLowerCase().includes("taj")) },
    { name: "The Leela", count: getCount((h) => h.name.toLowerCase().includes("leela")) },
    { name: "Radisson", count: getCount((h) => h.name.toLowerCase().includes("radisson")) },
    { name: "Clarks Inn", count: getCount((h) => h.name.toLowerCase().includes("clarks")) },
    { name: "Club Mahindra", count: getCount((h) => h.name.toLowerCase().includes("mahindra")) },
  ];

  const masterAmenities = ["Free WiFi", "Swimming Pool", "Spa", "Parking", "Restaurant", "Room Service", "Bar", "Fitness Center"];
  const amenitiesList = masterAmenities.map((am) => ({
    name: am,
    count: getCount((h) => h.amenities.some((ha) => ha.toLowerCase().includes(am.toLowerCase()))),
  }));

  const houseRules = [
    { name: "Caretaker", count: getCount((h) => h.amenities.some((a) => a.toLowerCase().includes("room service"))) },
    { name: "Instant Book", count: hotels.length },
    { name: "Entire Villas & Apartments", count: getCount((h) => h.name.toLowerCase().includes("villa") || h.name.toLowerCase().includes("apartment")) },
    { name: "Homestays", count: getCount((h) => h.name.toLowerCase().includes("homestay")) },
    { name: "Star Host Properties", count: getCount((h) => h.stars >= 4) },
    { name: "Pets Allowed", count: getCount((h) => h.amenities.some((a) => a.toLowerCase().includes("pet"))) },
    { name: "Unmarried Couples Allowed", count: getCount((h) => h.description?.toLowerCase().includes("couple") || true) },
  ];

  const flexibleTimingList = [
    { name: "Guaranteed Early Check-in", count: getCount((h) => !!h.checkInTime) },
    { name: "Guaranteed Late Check-out", count: getCount((h) => !!h.checkOutTime) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 text-left space-y-6 text-xs text-slate-800 font-sans sticky top-[75px] max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-thin">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-900 font-black">
          <Filter className="w-4 h-4 text-amber-600" />
          <span className="text-sm">Filter Results</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. For You */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>For You</span>
          {selectedDeals.length > 0 && (
            <button onClick={() => { setSelectedDeals([]); updateFilters({ selectedDeals: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {dealsForYou.map((deal) => (
            <label key={deal.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDeals.includes(deal.name)}
                  onChange={() => toggleArrayItem(selectedDeals, deal.name, setSelectedDeals, "selectedDeals")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium transition-colors">{deal.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({deal.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. Price Per Night */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Price Per Night</span>
          {selectedPriceRanges.length > 0 && (
            <button onClick={() => { setSelectedPriceRanges([]); updateFilters({ selectedPriceRanges: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.includes(range.label)}
                  onChange={() => toggleArrayItem(selectedPriceRanges, range.label, setSelectedPriceRanges, "selectedPriceRanges")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium transition-colors">{range.label}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({range.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. Star Category */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Star Category</span>
          {selectedStars.length > 0 && (
            <button onClick={() => { setSelectedStars([]); updateFilters({ selectedStars: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {[
            { star: 3, label: "3 Star", count: getCount((h) => h.stars === 3) },
            { star: 4, label: "4 Star", count: getCount((h) => h.stars === 4) },
            { star: 5, label: "5 Star", count: getCount((h) => h.stars === 5) },
          ].map((s) => (
            <label key={s.star} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(s.star)}
                  onChange={() => toggleStar(s.star)}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium flex items-center gap-1">
                  {s.label}
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({s.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4. User Rating */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>User Rating</span>
          {minRating > 0 && (
            <button onClick={() => { setMinRating(0); updateFilters({ minRating: 0 }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {[
            { val: 4.2, label: "Excellent: 4.2+", count: getCount((h) => h.rating >= 4.2) },
            { val: 3.5, label: "Very Good: 3.5+", count: getCount((h) => h.rating >= 3.5) },
            { val: 3.0, label: "Good: 3+", count: getCount((h) => h.rating >= 3.0) },
          ].map((r) => (
            <label key={r.label} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userRating"
                  checked={minRating === r.val}
                  onChange={() => { setMinRating(r.val); updateFilters({ minRating: r.val }); }}
                  className="w-3.5 h-3.5 accent-amber-600 cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{r.label}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({r.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 5. Property Type */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Property Type</span>
          {selectedPropertyTypes.length > 0 && (
            <button onClick={() => { setSelectedPropertyTypes([]); updateFilters({ selectedPropertyTypes: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {propertyTypes.map((pt) => (
            <label key={pt.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPropertyTypes.includes(pt.name)}
                  onChange={() => toggleArrayItem(selectedPropertyTypes, pt.name, setSelectedPropertyTypes, "selectedPropertyTypes")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{pt.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({pt.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 6. Top Locations */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Top Locations</span>
          {selectedLocations.length > 0 && (
            <button onClick={() => { setSelectedLocations([]); updateFilters({ selectedLocations: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {topLocations.map((loc) => {
            const count = getCount((h) => (h.location || h.address || "").toLowerCase().includes(loc.toLowerCase()));
            return (
              <label key={loc} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleArrayItem(selectedLocations, loc, setSelectedLocations, "selectedLocations")}
                    className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                  />
                  <span className="text-slate-700 group-hover:text-amber-600 font-medium">{loc}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 7. Room Views */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Room Views</span>
          {selectedViews.length > 0 && (
            <button onClick={() => { setSelectedViews([]); updateFilters({ selectedViews: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {roomViews.map((rv) => (
            <label key={rv.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedViews.includes(rv.name)}
                  onChange={() => toggleArrayItem(selectedViews, rv.name, setSelectedViews, "selectedViews")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{rv.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({rv.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 8. Room Amenities */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Room Amenities</span>
          {selectedRoomAmenities.length > 0 && (
            <button onClick={() => { setSelectedRoomAmenities([]); updateFilters({ selectedRoomAmenities: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {roomAmenities.map((ra) => (
            <label key={ra.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRoomAmenities.includes(ra.name)}
                  onChange={() => toggleArrayItem(selectedRoomAmenities, ra.name, setSelectedRoomAmenities, "selectedRoomAmenities")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{ra.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({ra.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 9. Chains */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Hotel Chains</span>
          {selectedChains.length > 0 && (
            <button onClick={() => { setSelectedChains([]); updateFilters({ selectedChains: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2">
          {chainsList.map((ch) => (
            <label key={ch.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedChains.includes(ch.name)}
                  onChange={() => toggleArrayItem(selectedChains, ch.name, setSelectedChains, "selectedChains")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{ch.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({ch.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 10. Amenities */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Amenities</span>
          {selectedAmenities.length > 0 && (
            <button onClick={() => { setSelectedAmenities([]); updateFilters({ selectedAmenities: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="relative mb-2">
          <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search amenities"
            value={amenitySearch}
            onChange={(e) => setAmenitySearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-amber-500"
          />
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {amenitiesList
            .filter((a) => a.name.toLowerCase().includes(amenitySearch.toLowerCase()))
            .map((am) => (
              <label key={am.name} className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(am.name)}
                    onChange={() => toggleArrayItem(selectedAmenities, am.name, setSelectedAmenities, "selectedAmenities")}
                    className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                  />
                  <span className="text-slate-700 group-hover:text-amber-600 font-medium">{am.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">({am.count})</span>
              </label>
            ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 11. Booking Preference & House Rules */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>House Rules & Preferences</span>
          {selectedRules.length > 0 && (
            <button onClick={() => { setSelectedRules([]); updateFilters({ selectedRules: [] }); }} className="text-[10px] text-amber-600 font-bold hover:underline">Clear</button>
          )}
        </h4>
        <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1">
          {houseRules.map((hr) => (
            <label key={hr.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRules.includes(hr.name)}
                  onChange={() => toggleArrayItem(selectedRules, hr.name, setSelectedRules, "selectedRules")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{hr.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({hr.count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 12. Flexible Check-in/out */}
      <div>
        <h4 className="font-black text-slate-900 text-xs mb-2.5 uppercase tracking-wider flex items-center justify-between">
          <span>Flexible Check-in/out</span>
        </h4>
        <div className="space-y-2">
          {flexibleTimingList.map((ft) => (
            <label key={ft.name} className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={flexibleTiming.includes(ft.name)}
                  onChange={() => toggleArrayItem(flexibleTiming, ft.name, setFlexibleTiming, "flexibleTiming")}
                  className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-amber-600 font-medium">{ft.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">({ft.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset All Filters Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
        </button>
      </div>

    </div>
  );
}
