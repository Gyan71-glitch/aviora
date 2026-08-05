"use client";

import { FareType } from "./FareTypeSelector";
import { GraduationCap, Shield, UserCheck, Stethoscope, Briefcase } from "lucide-react";

interface Props {
  fareType: FareType;
  onResetToRegular: () => void;
}

export default function SpecialFareBanner({ fareType, onResetToRegular }: Props) {
  if (fareType === "regular") return null;

  const contentMap: Record<
    Exclude<FareType, "regular">,
    { icon: React.ReactNode; title: string; desc: string }
  > = {
    student: {
      icon: <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0" />,
      title: "Showing itineraries with special fares for Students.",
      desc: "Includes extra 10kg check-in baggage. Student ID card required at airport check-in.",
    },
    armed_forces: {
      icon: <Shield className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: "Showing itineraries with special fares for Armed Forces.",
      desc: "Exclusive defense personnel discounts. Military ID required at airport check-in.",
    },
    gst: {
      icon: <Briefcase className="w-5 h-5 text-purple-600 shrink-0" />,
      title: "GST Business Fare enabled.",
      desc: "Claim GST input tax credit for your corporate booking.",
    },
    senior_citizen: {
      icon: <UserCheck className="w-5 h-5 text-amber-600 shrink-0" />,
      title: "Showing itineraries with special fares for Senior Citizens.",
      desc: "Special discounted fares for passengers aged 60+. Valid Govt photo ID required at check-in.",
    },
    doctors_nurses: {
      icon: <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />,
      title: "Showing itineraries with special fares for Doctors and Nurses.",
      desc: "Frontline medical personnel special fares. Medical registration certificate required.",
    },
  };

  const current = contentMap[fareType];
  if (!current) return null;

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 my-3 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
          {current.icon}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">{current.title}</h4>
          <p className="text-[11px] text-slate-500 font-medium">{current.desc}</p>
        </div>
      </div>

      <button
        onClick={onResetToRegular}
        className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline shrink-0"
      >
        View regular fares
      </button>
    </div>
  );
}
