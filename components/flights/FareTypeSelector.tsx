"use client";

import { Check } from "lucide-react";

export type FareType =
  | "regular"
  | "student"
  | "armed_forces"
  | "gst"
  | "senior_citizen"
  | "doctors_nurses";

interface Props {
  fareType: FareType;
  onChangeFareType: (ft: FareType) => void;
  priceDropProtection: boolean;
  onChangePriceDropProtection: (val: boolean) => void;
}

export const FARE_TYPE_OPTIONS: { id: FareType; label: string; badge?: string; desc: string }[] = [
  { id: "regular", label: "Regular", desc: "Standard fares for all travellers" },
  { id: "student", label: "Student", desc: "Extra 10kg baggage + student discount" },
  { id: "armed_forces", label: "Armed Forces", desc: "Defense personnel discount" },
  { id: "gst", label: "Have a GST number ?", badge: "new", desc: "Claim GST input tax credit" },
  { id: "senior_citizen", label: "Senior Citizen", desc: "Special fares for age 60+" },
  { id: "doctors_nurses", label: "Doctor and Nurses", desc: "Special frontline medical fares" },
];

export default function FareTypeSelector({
  fareType,
  onChangeFareType,
  priceDropProtection,
  onChangePriceDropProtection,
}: Props) {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 py-2 px-1 text-xs select-none">
      {/* Fare Type Options */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[11px] mr-1">
          Fare Type:
        </span>

        {FARE_TYPE_OPTIONS.map((opt) => {
          const isSelected = fareType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeFareType(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${
                isSelected
                  ? "bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              title={opt.desc}
            >
              {/* Radio Indicator */}
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                  isSelected ? "border-amber-600 bg-amber-600" : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              <span>{opt.label}</span>

              {opt.badge && (
                <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Price Drop Protection Checkbox */}
      <label
        onClick={(e) => {
          e.preventDefault();
          onChangePriceDropProtection(!priceDropProtection);
        }}
        className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-opacity ml-auto"
      >
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            priceDropProtection
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-white border-slate-300 group-hover:border-amber-400"
          }`}
        >
          {priceDropProtection && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
        <span className="text-slate-800 text-xs font-semibold">Add Price Drop Protection</span>
      </label>
    </div>
  );
}
