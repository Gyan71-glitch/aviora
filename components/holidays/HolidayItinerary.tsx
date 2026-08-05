"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Utensils, Compass, CalendarCheck } from "lucide-react";
import { HolidayItineraryDay } from "@/lib/types";

interface HolidayItineraryProps {
  itinerary?: HolidayItineraryDay[];
}

export default function HolidayItinerary({ itinerary = [] }: HolidayItineraryProps) {
  const [openDays, setOpenDays] = useState<number[]>([1]);

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  if (itinerary.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
        <CalendarCheck className="w-5 h-5 text-gold-dark" />
        <h3 className="font-display text-2xl font-semibold text-midnight-navy tracking-wide">
          Day-by-Day Itinerary
        </h3>
      </div>

      <div className="space-y-4">
        {itinerary.map((item) => {
          const isOpen = openDays.includes(item.day);
          return (
            <div
              key={item.day}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleDay(item.day)}
                className="w-full p-4 md:p-5 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4 pr-4">
                  <span className="bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-mono font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm whitespace-nowrap">
                    Day {item.day}
                  </span>
                  <h4 className="font-semibold text-sm md:text-base text-midnight-navy">
                    {item.title}
                  </h4>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 bg-white space-y-4">
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold">
                    {item.meals && (
                      <div className="flex items-center gap-1.5 text-amber-900 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                        <Utensils className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Meals: {item.meals}</span>
                      </div>
                    )}
                    {item.activity && (
                      <div className="flex items-center gap-1.5 text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Compass className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Activity: {item.activity}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
