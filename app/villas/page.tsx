"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, Bed, Check, Home, ShieldCheck } from "lucide-react";
import { Villa } from "@/lib/types";

export default function VillasPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVillas() {
      setLoading(true);
      try {
        const res = await fetch("/api/villas/search");
        const data = await res.json();
        if (data.success) setVillas(data.villas);
      } catch (err) {
        console.error("Failed to fetch villas", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVillas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container-aviora">
        <div className="mb-8 text-center md:text-left">
          <span className="section-label mb-2 inline-block tracking-[0.3em] font-bold">
            MTTPL Luxury Stays
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-midnight-navy tracking-wide">
            Villas & Private Homestays
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl font-normal">
            Book private pool villas in Goa, mountain chalets in Manali, and heritage estate homestays in Coorg.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {villas.map((v) => (
              <div key={v.id} className="glass-card rounded-2xl overflow-hidden bg-white/95 transition-all hover:shadow-xl hover:border-gold">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                    <Image src={v.image} alt={v.name} fill className="object-cover" />
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span>{v.rating} ({v.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                            Luxury Villa • {v.bedrooms} Bedrooms
                          </span>
                          <h3 className="font-display text-2xl font-bold text-midnight-navy">{v.name}</h3>
                        </div>
                        <span className="bg-slate-100 border border-slate-200 text-xs px-2.5 py-1 rounded-lg font-bold text-slate-800">
                          Up to {v.maxGuests} Guests
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                        <span>{v.location}, {v.country}</span>
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {v.amenities.map((a, i) => (
                          <span key={i} className="bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-gold-dark" /> {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">Per Night Rate</div>
                        <div className="text-2xl font-bold font-display text-midnight-navy">
                          ₹{v.pricePerNight.toLocaleString()} <span className="text-xs text-slate-500">/ night</span>
                        </div>
                      </div>

                      <Link href={`/ticket/ord_villa_${v.id}`} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
                        Reserve Villa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
