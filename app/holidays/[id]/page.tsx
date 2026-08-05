"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, Check, X, Building2, Plane, ShieldCheck, ChevronRight } from "lucide-react";
import { HolidayPackage } from "@/lib/types";
import HolidayGallery from "@/components/holidays/HolidayGallery";
import HolidayItinerary from "@/components/holidays/HolidayItinerary";
import HolidayBookingCard from "@/components/holidays/HolidayBookingCard";

export default function HolidayDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pkg, setPkg] = useState<HolidayPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      try {
        const res = await fetch(`/api/holidays/${id}`);
        const data = await res.json();
        if (data.success) {
          setPkg(data.package);
        } else {
          setPkg(null);
        }
      } catch (err) {
        console.error("Failed to fetch package:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-28 pb-20">
        <div className="container-aviora">
          <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </main>
    );
  }

  if (!pkg) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container-aviora">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-gold-dark">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/holidays" className="hover:text-gold-dark">
            Holiday Packages
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-midnight-navy font-semibold truncate max-w-xs">{pkg.title}</span>
        </div>

        {/* Title Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                {pkg.category} Package
              </span>
              <span className="text-xs text-slate-500 font-medium">• {pkg.durationNights} Nights / {pkg.durationDays} Days</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-midnight-navy tracking-wide">
              {pkg.title}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm flex items-center gap-1.5 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-gold-dark shrink-0" />
              <span>{pkg.destination}, {pkg.country}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-sm font-bold text-midnight-navy">{pkg.rating}</span>
            <span className="text-xs text-slate-500 font-medium">({pkg.reviewCount} Reviews)</span>
          </div>
        </div>

        {/* Gallery */}
        <HolidayGallery
          title={pkg.title}
          image={pkg.image}
          gallery={pkg.gallery}
          featured={pkg.featured}
        />

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Details, Highlights, Itinerary) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Highlights */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-midnight-navy mb-3">
                  Package Overview
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {pkg.description}
                </p>
              </div>

              {/* Highlights List */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-4 font-bold">
                    Key Highlights & Experiences
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                      >
                        <Check className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-medium leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Included Hotel & Flight Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pkg.hotelInfo && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Building2 className="w-6 h-6 text-gold-dark" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Included Resort</div>
                    <h4 className="font-bold text-sm text-midnight-navy mt-0.5">{pkg.hotelInfo.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{pkg.hotelInfo.roomType}</p>
                  </div>
                </div>
              )}

              {pkg.flightInfo && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                    <Plane className="w-6 h-6 text-midnight-navy" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Included Flights</div>
                    <h4 className="font-bold text-sm text-midnight-navy mt-0.5">{pkg.flightInfo.airline}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{pkg.flightInfo.route}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Day-by-Day Itinerary Component */}
            <HolidayItinerary itinerary={pkg.itinerary} />

            {/* Inclusions & Exclusions Grid */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-display text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  What&apos;s Included
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <div>
                  <h4 className="font-display text-xl font-semibold text-rose-800 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-rose-500" />
                    What&apos;s Excluded
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-normal">
                    {pkg.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sticky Booking Card) */}
          <div className="lg:col-span-1">
            <HolidayBookingCard pkg={pkg} />
          </div>
        </div>
      </div>
    </main>
  );
}
