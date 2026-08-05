"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Check, Sparkles } from "lucide-react";
import { HolidayPackage } from "@/lib/types";

interface HolidayCardProps {
  pkg: HolidayPackage;
}

export default function HolidayCard({ pkg }: HolidayCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl hover:border-gold">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          {pkg.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Bestseller
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span className="font-semibold">{pkg.durationNights} Nights / {pkg.durationDays} Days</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 flex-1 flex flex-col justify-between bg-white/90">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block mb-1">
                  {pkg.category} Package • {pkg.country}
                </span>
                <Link href={`/holidays/${pkg.id}`} className="hover:underline">
                  <h3 className="font-display text-2xl font-semibold text-midnight-navy tracking-wide">
                    {pkg.title}
                  </h3>
                </Link>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-xs font-bold text-slate-800">{pkg.rating}</span>
                <span className="text-[10px] text-slate-500">({pkg.reviewCount})</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
              <span>{pkg.destination}, {pkg.country}</span>
            </p>

            <p className="text-slate-600 text-sm line-clamp-2 mb-4 font-normal leading-relaxed">
              {pkg.description}
            </p>

            {/* Inclusions Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {pkg.inclusions.map((inc, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold"
                >
                  <Check className="w-3 h-3 text-gold-dark" />
                  {inc}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Price per person starting from</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-display text-midnight-navy">
                  ₹{pkg.pricePerPerson.toLocaleString()}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-slate-500">/ person</span>
              </div>
            </div>

            <Link
              href={`/holidays/${pkg.id}`}
              className="btn-gold w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-gold/30 inline-block text-center"
            >
              Explore Package
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
