"use client";

import { useState } from "react";
import { Star, Filter, RotateCcw } from "lucide-react";

interface HotelSidebarProps {
  onFilterChange: (filters: {
    selectedStars: number[];
    priceRange: [number, number];
    selectedAmenities: string[];
  }) => void;
}

export default function HotelSidebar({ onFilterChange }: HotelSidebarProps) {
  const [selectedStars, setSelectedStars] = useState<number[]>([5, 4]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenitiesList = [
    "Infinity Pool",
    "Private Beach",
    "Spa",
    "Fine Dining",
    "Free WiFi",
    "Butler Service",
    "Gym",
    "Airport Transfer",
  ];

  const handleStarToggle = (star: number) => {
    const updated = selectedStars.includes(star)
      ? selectedStars.filter((s) => s !== star)
      : [...selectedStars, star];
    setSelectedStars(updated);
    onFilterChange({ selectedStars: updated, priceRange: [0, maxPrice], selectedAmenities });
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updated);
    onFilterChange({ selectedStars, priceRange: [0, maxPrice], selectedAmenities: updated });
  };

  const handlePriceChange = (val: number) => {
    setMaxPrice(val);
    onFilterChange({ selectedStars, priceRange: [0, val], selectedAmenities });
  };

  const handleReset = () => {
    setSelectedStars([5, 4, 3]);
    setMaxPrice(100000);
    setSelectedAmenities([]);
    onFilterChange({ selectedStars: [5, 4, 3], priceRange: [0, 100000], selectedAmenities: [] });
  };

  return (
    <div className="glass-dark p-6 rounded-2xl border border-white/10 space-y-6 sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-gold">
          <Filter className="w-4 h-4" />
          <h3 className="font-display font-semibold text-lg tracking-wide text-white">
            Filter Hotels
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-white/50 hover:text-gold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Star Rating Filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-white/60 mb-3 font-semibold">
          Star Rating
        </h4>
        <div className="space-y-2">
          {[5, 4, 3].map((star) => (
            <label
              key={star}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => handleStarToggle(star)}
                  className="accent-gold rounded"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: star }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-white/60 font-mono">{star}-Star Luxury</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="uppercase tracking-wider text-white/60 font-semibold">Max Price</span>
          <span className="text-gold font-mono font-semibold">₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="5000"
          value={maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-gold bg-white/10 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
          <span>₹10,000</span>
          <span>₹100,000+</span>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-white/60 mb-3 font-semibold">
          Amenities
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-xs text-white/80 cursor-pointer hover:text-gold transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="accent-gold rounded"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
