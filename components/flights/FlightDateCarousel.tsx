"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Flight } from "@/app/flights/page";

interface Props {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  flights: Flight[];
}

export default function FlightDateCarousel({ selectedDate, onSelectDate, flights }: Props) {
  // Today's ISO date string (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Local scroll/view offset (in days) relative to the selectedDate
  const [viewOffset, setViewOffset] = useState(0);

  // Reset viewOffset whenever selectedDate changes
  useEffect(() => {
    setViewOffset(0);
  }, [selectedDate]);

  // Compute minimum price from current search results as base reference
  const currentMinPrice = useMemo(() => {
    if (!flights || flights.length === 0) return 5963;
    return Math.min(...flights.map((f) => f.price));
  }, [flights]);

  // Generate 7 consecutive valid days (no past dates)
  const dateItems = useMemo(() => {
    const base = new Date(selectedDate || Date.now());
    const centerTime = base.getTime() + viewOffset * 86400000;
    let centerDate = new Date(centerTime);

    // If centerDate is before today, clamp to today
    const today = new Date(todayStr);
    if (centerDate < today) {
      centerDate = today;
    }

    const items = [];
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    const priceVariations = [1.08, 0.95, 0.98, 1.0, 0.88, 1.02, 0.96];

    for (let i = 0; i < offsets.length; i++) {
      const offset = offsets[i];
      const d = new Date(centerDate.getTime() + offset * 86400000);
      const isoDate = d.toISOString().split("T")[0];
      const isPast = isoDate < todayStr;

      // Format string like "Thu, Aug 6"
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const dayNum = d.getDate();
      const label = `${dayName}, ${monthName} ${dayNum}`;

      // Calculate deterministic price variation
      let price = Math.round((currentMinPrice * priceVariations[(i + Math.abs(viewOffset)) % priceVariations.length]) / 10) * 10;
      if (isoDate === selectedDate && flights.length > 0) {
        price = currentMinPrice;
      }

      items.push({
        isoDate,
        label,
        price,
        isPast,
        isSelected: isoDate === selectedDate,
      });
    }

    // Filter out items in the past
    return items.filter((item) => !item.isPast);
  }, [selectedDate, viewOffset, todayStr, currentMinPrice, flights]);

  // Check if scrolling back would show dates before today
  const canScrollPrev = useMemo(() => {
    if (dateItems.length === 0) return false;
    const firstDate = dateItems[0].isoDate;
    return firstDate > todayStr;
  }, [dateItems, todayStr]);

  const handlePrevWindow = () => {
    if (!canScrollPrev) return;
    setViewOffset((prev) => prev - 3);
  };

  const handleNextWindow = () => {
    setViewOffset((prev) => prev + 3);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs my-4 overflow-hidden select-none">
      <div className="flex items-center justify-between p-1.5">
        {/* Left Arrow - Scrolls calendar window only */}
        <button
          type="button"
          onClick={handlePrevWindow}
          disabled={!canScrollPrev}
          className={`w-8 h-10 flex items-center justify-center rounded-xl transition-colors shrink-0 ${
            canScrollPrev
              ? "text-slate-600 hover:text-amber-800 hover:bg-amber-50 cursor-pointer"
              : "text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title={canScrollPrev ? "Scroll previous dates" : "Cannot scroll into past dates"}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Date Items Grid */}
        <div className="flex items-center gap-1.5 grow overflow-x-auto no-scrollbar py-1 px-1">
          {dateItems.map((item) => (
            <button
              key={item.isoDate}
              type="button"
              onClick={() => onSelectDate(item.isoDate)}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                item.isSelected
                  ? "border-amber-500 bg-amber-50/70 shadow-xs"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  item.isSelected ? "text-amber-900 font-extrabold" : "text-slate-600"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`text-xs mt-0.5 ${
                  item.isSelected ? "text-amber-800 font-extrabold" : "text-emerald-600 font-bold"
                }`}
              >
                ₹ {item.price.toLocaleString("en-IN")}
              </span>

              {/* Active Bottom Highlight Bar */}
              {item.isSelected && (
                <div className="absolute bottom-0 left-3 right-3 h-1 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Arrow - Scrolls calendar window only */}
        <button
          type="button"
          onClick={handleNextWindow}
          className="w-8 h-10 flex items-center justify-center text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors shrink-0 cursor-pointer"
          title="Scroll next dates"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
