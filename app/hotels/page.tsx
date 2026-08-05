"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchTopBar from "@/components/hotels/HotelSearchTopBar";
import HotelSidebar, { HotelSidebarFilters } from "@/components/hotels/HotelSidebar";
import HotelCard from "@/components/hotels/HotelCard";
import { Hotel } from "@/lib/types";

function HotelsContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const paramMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const paramMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 200000;
  const roomsCount = Number(searchParams.get("rooms")) || 1;
  const adultsCount = Number(searchParams.get("adults")) || 2;
  const childrenCount = Number(searchParams.get("children")) || 0;

  const inDate = checkIn ? new Date(checkIn) : null;
  const outDate = checkOut ? new Date(checkOut) : null;
  const stayNights =
    inDate && outDate && !isNaN(inDate.getTime()) && !isNaN(outDate.getTime())
      ? Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

  const [rawHotels, setRawHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(initialDestination);
  const [sortBy, setSortBy] = useState("popularity");
  const [sidebarFilters, setSidebarFilters] = useState<HotelSidebarFilters>({
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

  useEffect(() => {
    setDestination(searchParams.get("destination") || "");
  }, [searchParams]);

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          destination,
          checkIn,
          checkOut,
          minPrice: paramMinPrice.toString(),
          maxPrice: paramMaxPrice.toString(),
          sortBy,
        });

        const res = await fetch(`/api/hotels/search?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setRawHotels(data.hotels as Hotel[]);
        }
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [destination, checkIn, checkOut, paramMinPrice, paramMaxPrice, sortBy]);

  useEffect(() => {
    let list = [...rawHotels];

    if (sidebarFilters.searchQuery.trim()) {
      const q = sidebarFilters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.address?.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)
      );
    }

    if (sidebarFilters.selectedStars.length > 0) {
      list = list.filter((h) => sidebarFilters.selectedStars.includes(h.stars));
    }

    if (sidebarFilters.minRating > 0) {
      list = list.filter((h) => h.rating >= sidebarFilters.minRating);
    }

    if (sidebarFilters.selectedAmenities.length > 0) {
      list = list.filter((h) =>
        sidebarFilters.selectedAmenities.every((a) =>
          h.amenities.some((ha) => ha.toLowerCase().includes(a.toLowerCase()))
        )
      );
    }

    if (sidebarFilters.selectedPriceRanges.length > 0) {
      list = list.filter((h) => {
        return sidebarFilters.selectedPriceRanges.some((range) => {
          if (range.includes("0 - 1500")) return h.pricePerNight <= 1500;
          if (range.includes("1500 - 2500")) return h.pricePerNight >= 1500 && h.pricePerNight <= 2500;
          if (range.includes("2500 - 3500")) return h.pricePerNight >= 2500 && h.pricePerNight <= 3500;
          if (range.includes("3500 - 5500")) return h.pricePerNight >= 3500 && h.pricePerNight <= 5500;
          if (range.includes("5500 - 8000")) return h.pricePerNight >= 5500 && h.pricePerNight <= 8000;
          if (range.includes("8000+")) return h.pricePerNight >= 8000;
          return true;
        });
      });
    }

    if (sidebarFilters.selectedPropertyTypes.length > 0) {
      list = list.filter((h) =>
        sidebarFilters.selectedPropertyTypes.some(
          (pt) =>
            h.name.toLowerCase().includes(pt.toLowerCase()) ||
            h.tags?.some((t) => t.toLowerCase().includes(pt.toLowerCase()))
        )
      );
    }

    if (sidebarFilters.selectedLocations.length > 0) {
      list = list.filter((h) =>
        sidebarFilters.selectedLocations.some(
          (loc) =>
            h.location.toLowerCase().includes(loc.toLowerCase()) ||
            h.address?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    setFilteredHotels(list);
  }, [rawHotels, sidebarFilters]);

  const handleFilterChange = (filters: HotelSidebarFilters) => {
    setSidebarFilters(filters);
  };

  const formatDisplayDate = (dStr: string, fallback: string) => {
    if (!dStr) return fallback;
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container-aviora">
        <div className="mb-8 text-center md:text-left">
          <span className="section-label mb-2 inline-block tracking-[0.3em] font-bold uppercase text-amber-600">
            MTTPL Hotels & Resorts
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-midnight-navy tracking-wide">
            Luxury Stays & Overwater Resorts
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl font-normal">
            Book hand-picked 5-star hotels, beachfront villas, and iconic city stays with exclusive member perks and instant confirmation.
          </p>
        </div>

        <HotelSearchTopBar
          destination={destination || "Shimla"}
          checkIn={formatDisplayDate(checkIn, "Fri, 7 Aug 2026")}
          checkOut={formatDisplayDate(checkOut, "Sat, 8 Aug 2026")}
          guestsCount={adultsCount + childrenCount}
          roomsCount={roomsCount}
          totalProperties={filteredHotels.length > 0 ? filteredHotels.length : rawHotels.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSearchSubmit={({ destination: newDest }) => {
            if (newDest) setDestination(newDest);
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1 sticky top-[75px]">
            <HotelSidebar hotels={rawHotels} onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="glass-dark p-12 text-center rounded-2xl border border-slate-200 bg-white">
                <h3 className="font-display text-2xl text-midnight-navy mb-2">No Hotels Match Your Filters</h3>
                <p className="text-slate-500 text-sm">
                  Try adjusting your price range or star ratings to explore luxury properties.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-slate-500 font-mono font-medium">
                    Showing {filteredHotels.length} luxury properties ({stayNights} {stayNights === 1 ? "night" : "nights"})
                  </p>
                  {paramMaxPrice < 200000 && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                      Prioritizing selected budget (₹{paramMinPrice.toLocaleString()} - ₹{paramMaxPrice.toLocaleString()})
                    </span>
                  )}
                </div>
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    nights={stayNights}
                    minPrice={paramMinPrice}
                    maxPrice={paramMaxPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-28 pb-20 container-aviora animate-pulse">Loading hotels...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
