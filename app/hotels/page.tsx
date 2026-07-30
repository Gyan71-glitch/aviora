"use client";

import { useState, useEffect } from "react";
import HotelSearchTopBar from "@/components/hotels/HotelSearchTopBar";
import HotelSidebar from "@/components/hotels/HotelSidebar";
import HotelCard from "@/components/hotels/HotelCard";
import { Hotel } from "@/lib/types";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("Dubai");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedStars, setSelectedStars] = useState<number[]>([5, 4, 3]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          destination,
          sortBy,
          maxPrice: maxPrice.toString(),
        });
        selectedStars.forEach((star) => query.append("stars", star.toString()));

        const res = await fetch(`/api/hotels/search?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          let list = data.hotels as Hotel[];
          // Filter amenities locally if selected
          if (selectedAmenities.length > 0) {
            list = list.filter((h) =>
              selectedAmenities.every((a) => h.amenities.includes(a))
            );
          }
          setHotels(list);
        }
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [destination, sortBy, selectedStars, maxPrice, selectedAmenities]);

  const handleFilterChange = (filters: {
    selectedStars: number[];
    priceRange: [number, number];
    selectedAmenities: string[];
  }) => {
    setSelectedStars(filters.selectedStars);
    setMaxPrice(filters.priceRange[1]);
    setSelectedAmenities(filters.selectedAmenities);
  };

  return (
    <main className="min-h-screen bg-midnight-navy pt-28 pb-20">
      <div className="container-aviora">
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="section-label mb-2 inline-block tracking-[0.3em]">
            Source My Trip Hotels
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white tracking-wide">
            Luxury Stays & Overwater Resorts
          </h1>
          <p className="text-white/60 text-sm mt-2 max-w-xl">
            Book hand-picked 5-star hotels, beachfront villas, and iconic city stays with exclusive member perks and instant confirmation.
          </p>
        </div>

        {/* Top Bar Summary */}
        <HotelSearchTopBar
          destination={destination}
          checkIn="15 Oct 2026"
          checkOut="20 Oct 2026"
          guestsCount={2}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Main Grid: Sidebar + Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <HotelSidebar onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="glass-dark p-12 text-center rounded-2xl border border-white/10">
                <h3 className="font-display text-2xl text-white mb-2">No Hotels Match Your Filters</h3>
                <p className="text-white/60 text-sm">
                  Try adjusting your price range or star ratings to explore luxury properties.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-white/50 mb-4 font-mono">
                  Showing {hotels.length} luxury properties found
                </p>
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
