"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Check, ShieldCheck } from "lucide-react";
import { Hotel } from "@/lib/types";

interface HotelCardProps {
  hotel: Hotel;
  nights?: number;
  minPrice?: number;
  maxPrice?: number;
}

export default function HotelCard({ hotel, nights = 1, minPrice, maxPrice }: HotelCardProps) {
  const [imgSrc, setImgSrc] = useState(
    hotel.image ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
  );

  const stayNights = Math.max(1, nights);
  const totalPrice = hotel.pricePerNight * stayNights;
  const isBudgetMatch =
    minPrice !== undefined &&
    maxPrice !== undefined &&
    maxPrice < 200000 &&
    hotel.pricePerNight >= minPrice &&
    hotel.pricePerNight <= maxPrice;

  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl hover:border-gold bg-white/95 relative">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={imgSrc}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={() =>
              setImgSrc(
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              )
            }
          />
          {isBudgetMatch ? (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Selected Budget Match
            </div>
          ) : hotel.featured ? (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Featured Luxury
            </div>
          ) : null}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="font-bold">{hotel.rating}</span>
            <span className="text-white/70">({hotel.reviewCount} reviews)</span>
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
                <h3 className="font-display text-2xl font-semibold text-midnight-navy tracking-wide">
                  {hotel.name}
                </h3>
              </div>
              <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-gold-dark text-xs font-mono font-bold">
                {hotel.city}, {hotel.country}
              </span>
            </div>

            <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
              <span>{hotel.location}</span>
            </p>

            {hotel.description && (
              <p className="text-slate-600 text-sm line-clamp-2 mb-4 font-normal leading-relaxed">
                {hotel.description}
              </p>
            )}

            {/* Amenities Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold"
                >
                  <Check className="w-3 h-3 text-gold-dark" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Booking Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">Per night rate</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-display text-midnight-navy">
                  ₹{hotel.pricePerNight.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">/ night</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1">
                  ₹{totalPrice.toLocaleString()} <span className="font-medium text-slate-700">Total for {stayNights} {stayNights === 1 ? "Night" : "Nights"}</span>
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free cancellation</span>
                </span>
              </div>
            </div>

            <Link
              href={`/hotels/${hotel.id}`}
              className="btn-gold w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-gold/30 inline-block text-center"
            >
              View Rooms & Reserve
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
