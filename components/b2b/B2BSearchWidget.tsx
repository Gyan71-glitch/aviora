"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Building, Compass, Car, Search, ToggleLeft, ToggleRight, ShieldCheck } from "lucide-react";

export default function B2BSearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"flights" | "hotels" | "packages" | "transfers">("flights");
  const [from, setFrom] = useState("New Delhi (DEL)");
  const [to, setTo] = useState("Dubai (DXB)");
  const [showNetFare, setShowNetFare] = useState(true);
  const [agentMarkupPct, setAgentMarkupPct] = useState<number>(5.0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "flights") {
      router.push(`/flights?from=DEL&to=DXB&markup=${agentMarkupPct}&mode=b2b`);
    } else if (activeTab === "hotels") {
      router.push(`/hotels?destination=Dubai&markup=${agentMarkupPct}&mode=b2b`);
    } else if (activeTab === "packages") {
      router.push(`/holidays?destination=Dubai&mode=b2b`);
    } else {
      router.push(`/transfers?mode=b2b`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-slate-900">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "flights" ? "bg-slate-900 text-amber-400 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plane className="w-4 h-4" /> Flights
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "hotels" ? "bg-slate-900 text-amber-400 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building className="w-4 h-4" /> Hotels
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "packages" ? "bg-slate-900 text-amber-400 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4" /> Packages
          </button>
          <button
            onClick={() => setActiveTab("transfers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "transfers" ? "bg-slate-900 text-amber-400 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-4 h-4" /> Transfers
          </button>
        </div>

        {/* Agent Controls: Net Fare & Custom Markup */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
          {/* Net Fare Toggle */}
          <button
            type="button"
            onClick={() => setShowNetFare(!showNetFare)}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold"
          >
            {showNetFare ? (
              <ToggleRight className="w-6 h-6 text-amber-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
            <span>Show Net Agency Fare</span>
          </button>

          <div className="h-4 w-px bg-slate-300" />

          {/* Markup Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Agent Markup:</span>
            <input
              type="number"
              min="0"
              max="25"
              step="0.5"
              value={agentMarkupPct}
              onChange={(e) => setAgentMarkupPct(parseFloat(e.target.value) || 0)}
              className="w-14 px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-xs text-center focus:outline-none focus:border-amber-500"
            />
            <span className="text-slate-900 font-bold">%</span>
          </div>
        </div>
      </div>

      {/* Search Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* From */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Origin
          </label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
          />
        </div>

        {/* To */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Destination
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
          />
        </div>

        {/* Date */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Travel Date
          </label>
          <input
            type="date"
            defaultValue="2026-08-20"
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
          />
        </div>

        {/* Search Submit */}
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl p-4 flex items-center justify-center gap-2 shadow-md transition-all text-sm"
        >
          <Search className="w-5 h-5" />
          Search Agent Net Rates
        </button>
      </form>

      {/* Net Fare Preview Note */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600 bg-amber-50/70 px-4 py-2.5 rounded-xl border border-amber-200">
        <span className="flex items-center gap-1.5 text-amber-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-600" /> B2B Special Agent Net Rates Active (Commission: Up to 8.5%)
        </span>
        <span>
          Net Fare Mode: <strong className="text-slate-900">Active (Agent ID: MTTPL-AGT-88219)</strong>
        </span>
      </div>
    </div>
  );
}
