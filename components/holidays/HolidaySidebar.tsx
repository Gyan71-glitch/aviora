"use client";

import { useState } from "react";
import { Filter, RotateCcw, Compass } from "lucide-react";

interface HolidaySidebarProps {
  onFilterChange: (filters: {
    selectedCategory: string;
    maxPrice: number;
  }) => void;
}

export default function HolidaySidebar({ onFilterChange }: HolidaySidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(200000);

  const categories = [
    { id: "", label: "All Holiday Types" },
    { id: "romantic", label: "Romantic & Honeymoon" },
    { id: "luxury", label: "Ultra Luxury Escapes" },
    { id: "family", label: "Family Vacations" },
    { id: "adventure", label: "Wellness & Adventure" },
  ];

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    onFilterChange({ selectedCategory: catId, maxPrice });
  };

  const handlePriceChange = (val: number) => {
    setMaxPrice(val);
    onFilterChange({ selectedCategory, maxPrice: val });
  };

  const handleReset = () => {
    setSelectedCategory("");
    setMaxPrice(200000);
    onFilterChange({ selectedCategory: "", maxPrice: 200000 });
  };

  return (
    <div className="glass-dark p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24 bg-white/90">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-gold-dark font-semibold">
          <Filter className="w-4 h-4 text-gold-dark" />
          <h3 className="font-display font-semibold text-lg tracking-wide text-midnight-navy">
            Filter Packages
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-gold-dark flex items-center gap-1 transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
          Package Category
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                selectedCategory === cat.id
                  ? "bg-amber-500/10 border-gold-dark text-amber-900 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-gold hover:text-midnight-navy"
              }`}
            >
              <span>{cat.label}</span>
              <Compass className="w-3.5 h-3.5 opacity-60 text-gold-dark" />
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="uppercase tracking-wider text-slate-500 font-semibold">Max Price</span>
          <span className="text-gold-dark font-mono font-bold">₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="25000"
          max="200000"
          step="10000"
          value={maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-gold bg-slate-200 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono font-medium">
          <span>₹25,000</span>
          <span>₹200,000+</span>
        </div>
      </div>
    </div>
  );
}
