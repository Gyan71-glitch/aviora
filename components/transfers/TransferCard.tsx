"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, Check, ShieldCheck, Sparkles, Car } from "lucide-react";
import { TransferOption } from "@/lib/types";

interface TransferCardProps {
  transfer: TransferOption;
}

export default function TransferCard({ transfer }: TransferCardProps) {
  const [imgSrc, setImgSrc] = useState(
    transfer.image ||
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl hover:border-gold bg-white/95">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={imgSrc}
            alt={transfer.vehicleName}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={() =>
              setImgSrc(
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
              )
            }
          />
          {transfer.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              VIP Preferred
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gold" /> {transfer.capacityPassengers} Seats
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-gold" /> {transfer.baggageCount} Bags
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block mb-1">
                  {transfer.vehicleClass}
                </span>
                <h3 className="font-display text-2xl font-semibold text-midnight-navy tracking-wide">
                  {transfer.vehicleName}
                </h3>
              </div>
              <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                {transfer.vehicleType.toUpperCase()}
              </span>
            </div>

            <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4 font-medium">
              <Car className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
              <span>{transfer.pickupLocation} → {transfer.dropoffLocation}</span>
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-2 mb-4">
              {transfer.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold"
                >
                  <Check className="w-3 h-3 text-gold-dark" />
                  {feat}
                </span>
              ))}
            </div>

            <p className="text-emerald-700 text-xs flex items-center gap-1 font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>{transfer.cancellationPolicy}</span>
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total one-way rate</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-display text-midnight-navy">
                  ₹{transfer.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ vehicle</span>
              </div>
            </div>

            <Link
              href={`/ticket/ord_transfer_${transfer.id}`}
              className="btn-gold w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-gold/30 inline-block text-center"
            >
              Book Chauffeur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
