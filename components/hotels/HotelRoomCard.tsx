"use client";

import { Check, Users, ShieldCheck, Utensils, Bed } from "lucide-react";
import { RoomOption } from "@/lib/types";

interface HotelRoomCardProps {
  room: RoomOption;
  hotelName: string;
}

export default function HotelRoomCard({ room, hotelName }: HotelRoomCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 mb-4 border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-gold">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Room Information */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-gold-dark" />
            <h4 className="font-display text-xl font-bold text-midnight-navy tracking-wide">
              {room.roomType}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
              <Utensils className="w-3.5 h-3.5 text-gold-dark" />
              {room.boardBasis}
            </span>

            <span className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-gold-dark" />
              Max {room.maxOccupancy} Guests
            </span>

            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {room.cancellationPolicy}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-gold-dark" /> Free High-Speed WiFi
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-gold-dark" /> Air Conditioning & Climate Control
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-gold-dark" /> Private Marble Bathroom
            </span>
          </div>
        </div>

        {/* Pricing & Select Button */}
        <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
          <div className="text-left md:text-right mb-3">
            <span className="text-xs text-slate-400 font-medium block">Rate per night</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-midnight-navy">
                ₹{room.pricePerNight.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Includes taxes & service fees
            </span>
          </div>

          <button className="btn-gold w-full px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">
            Reserve This Room
          </button>
        </div>
      </div>
    </div>
  );
}
