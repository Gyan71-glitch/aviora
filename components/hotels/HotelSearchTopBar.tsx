"use client";

import { Building2, Calendar, Users, ArrowUpDown } from "lucide-react";

interface HotelSearchTopBarProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function HotelSearchTopBar({
  destination,
  checkIn,
  checkOut,
  guestsCount,
  sortBy,
  onSortChange,
}: HotelSearchTopBarProps) {
  return (
    <div className="glass-dark p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Summary Badges */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-white">
          <Building2 className="w-4 h-4 text-gold" />
          <span className="font-medium">{destination || "Worldwide Luxury"}</span>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-white">
          <Calendar className="w-4 h-4 text-gold" />
          <span>
            {checkIn} - {checkOut}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-white">
          <Users className="w-4 h-4 text-gold" />
          <span>{guestsCount} Guests • 1 Room</span>
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="flex items-center gap-2 text-xs w-full md:w-auto justify-end">
        <ArrowUpDown className="w-4 h-4 text-gold" />
        <span className="text-white/60">Sort By:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-midnight-navy border border-white/15 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold"
        >
          <option value="popularity">Most Popular / Featured</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
