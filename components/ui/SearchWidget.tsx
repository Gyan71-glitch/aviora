"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building, Train, Car, Calendar, Users, Search, MapPin } from "lucide-react";

const TABS = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Building },
  { id: "trains", label: "Trains", icon: Train },
  { id: "cars", label: "Cars", icon: Car },
];

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto z-10 relative"
    >
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-3 rounded-full flex items-center gap-3 text-sm font-medium transition-colors ${
                  isActive ? "text-midnight-navy" : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/60 shadow-2xl relative overflow-hidden">
        {/* Subtle gold glow at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {activeTab === "flights" && (
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Origin & Destination */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase ml-1">From</label>
                    <div className="relative">
                      <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Where from?" className="aviora-input pl-11 pr-4 h-14" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase ml-1">To</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Where to?" className="aviora-input pl-11 pr-4 h-14" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Dates & Passengers */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase ml-1">Dates</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Add dates" className="aviora-input pl-11 pr-4 h-14" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase ml-1">Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="1 Passenger, Economy" className="aviora-input pl-11 pr-4 h-14" />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button className="btn-gold h-14 px-10 rounded-xl flex items-center justify-center gap-3 whitespace-nowrap w-full md:w-auto mt-6 md:mt-0 group shadow-lg shadow-gold/20">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>
            )}

            {activeTab === "hotels" && (
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase ml-1">Destination</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Where are you going?" className="aviora-input pl-11 pr-4 h-14" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase ml-1">Dates</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Check in - Check out" className="aviora-input pl-11 pr-4 h-14" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase ml-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="2 Guests, 1 Room" className="aviora-input pl-11 pr-4 h-14" />
                  </div>
                </div>
                <button className="btn-gold h-14 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 group shadow-lg shadow-gold/20">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>
            )}

            {(activeTab === "trains" || activeTab === "cars") && (
              <div className="flex justify-center py-8">
                <p className="text-gray-400 italic font-display text-xl">
                  {activeTab === "trains" ? "Premium Rail Journeys" : "Luxury Car Rentals"} coming soon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
