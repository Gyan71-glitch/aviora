"use client";

import Image from "next/image";
import { Star, MapPin, Wifi, Coffee, Check, ShieldCheck } from "lucide-react";
import { Hotel } from "@/lib/types";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl hover:border-gold/30">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          {hotel.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Featured Luxury
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-white/60">({hotel.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <h3 className="font-display text-2xl font-semibold text-white tracking-wide">
                  {hotel.name}
                </h3>
              </div>
              <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-gold text-xs font-mono">
                {hotel.city}, {hotel.country}
              </span>
            </div>

            <p className="text-white/60 text-xs flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>{hotel.location}</span>
            </p>

            {hotel.description && (
              <p className="text-white/70 text-sm line-clamp-2 mb-4 font-light leading-relaxed">
                {hotel.description}
              </p>
            )}

            {/* Amenities Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-white/5 border border-white/10 text-white/80 text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-gold" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Booking Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-white/50">Price per night starting from</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-display text-gold">
                  ₹{hotel.pricePerNight.toLocaleString()}
                </span>
                <span className="text-xs text-white/60">/ night</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Free cancellation available</span>
              </div>
            </div>

            <button className="btn-gold w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-gold/20">
              View Rooms & Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
