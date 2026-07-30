"use client";

import { useState } from "react";
import { Flight, SearchParams } from "@/app/flights/page";
import FlightCard from "./FlightCard";
import { Bell, Plane, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  total: number | null;
  searched: boolean;
  searchParams: SearchParams;
}

function parseDuration(dur: string): number {
  if (!dur || dur === "N/A") return 999999;
  const match = dur.match(/(\d+)h\s*(\d+)m/);
  if (!match) return 999999;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl mb-4 p-6 md:p-8 animate-pulse shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-100 rounded w-56" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
            <div className="hidden md:block h-4 bg-gray-200 rounded w-16" />
            <div className="hidden md:block h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
        <div className="md:w-48 flex flex-col gap-3 items-end">
          <div className="h-8 bg-gray-200 rounded w-28" />
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-10 bg-gold/20 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default function FlightResults({
  flights,
  loading,
  error,
  total,
  searched,
  searchParams,
}: Props) {
  const [sortBy, setSortBy] = useState<"cheapest" | "best" | "quickest">("cheapest");

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === "cheapest") return a.price - b.price;
    if (sortBy === "quickest") return parseDuration(a.duration) - parseDuration(b.duration);
    // "best" = weighted score of price + duration
    const scoreA = a.price / 5000 + parseDuration(a.duration) / 60;
    const scoreB = b.price / 5000 + parseDuration(b.duration) / 60;
    return scoreA - scoreB;
  });

  const cheapest = flights.length ? Math.min(...flights.map((f) => f.price)) : null;
  const quickestFlight = flights.length
    ? flights.reduce((prev, cur) =>
        parseDuration(prev.duration) < parseDuration(cur.duration) ? prev : cur
      )
    : null;

  // Pre-search empty state
  if (!searched && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <Plane className="w-10 h-10 text-gold" />
        </div>
        <h3 className="font-display text-3xl font-medium text-midnight-navy mb-3">
          Find Your Flight
        </h3>
        <p className="text-gray-500 max-w-sm text-base">
          Enter your origin, destination and travel date above to search
          real-time flights powered by TBO.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-3">
      {/* Sort Tabs */}
      {!loading && flights.length > 0 && (
        <div className="flex rounded-2xl overflow-hidden mb-2 bg-white shadow-sm border border-gray-200">
          {(
            [
              {
                key: "cheapest",
                label: "Cheapest",
                sub: cheapest
                  ? `₹${cheapest.toLocaleString()} · ${
                      flights.find((f) => f.price === cheapest)?.duration
                    }`
                  : "—",
              },
              { key: "best", label: "Best", sub: "Price & duration" },
              {
                key: "quickest",
                label: "Quickest",
                sub: quickestFlight
                  ? `₹${quickestFlight.price.toLocaleString()} · ${quickestFlight.duration}`
                  : "—",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex-1 py-4 px-6 text-center transition-colors border-b-2 ${
                sortBy === tab.key
                  ? "border-gold bg-gray-50"
                  : "border-transparent bg-white hover:bg-gray-50"
              }`}
            >
              <div
                className={`font-bold mb-1 text-sm ${
                  sortBy === tab.key ? "text-midnight-navy" : "text-gray-400"
                }`}
              >
                {tab.label}
              </div>
              <div className="text-xs text-gray-400">{tab.sub}</div>
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && searched && flights.length > 0 && (
        <p className="text-sm text-gray-500 font-medium mb-1">
          <span className="text-midnight-navy font-bold">{flights.length}</span>{" "}
          flights shown
          {total && total > flights.length ? ` of ${total} found` : ""} ·{" "}
          <span className="font-semibold">
            {searchParams.origin} → {searchParams.destination}
          </span>
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div>
          <div className="flex items-center gap-3 mb-5 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-gold" />
            <span className="text-sm font-medium">
              Searching real-time flights from TBO…
            </span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-white border border-red-100 rounded-2xl p-8 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-midnight-navy mb-1">
              Could not load flights
            </p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && !error && searched && flights.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
          <Plane className="w-12 h-12 text-gray-300 mb-4" />
          <p className="font-semibold text-midnight-navy text-lg mb-2">
            No flights found
          </p>
          <p className="text-sm text-gray-500">
            Try different dates or airport codes.
          </p>
        </div>
      )}

      {/* First batch of flight cards */}
      {!loading &&
        sorted.slice(0, 5).map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}

      {/* Price Alert Banner */}
      {!loading && flights.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm my-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">
              <span className="font-bold text-midnight-navy block md:inline">
                Track prices.
              </span>{" "}
              <span className="text-gray-500 block md:inline">
                Get alerts when fares drop for{" "}
                <strong>
                  {searchParams.origin} → {searchParams.destination}
                </strong>
                .
              </span>
            </div>
          </div>
          <div className="w-12 h-7 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gold/30 transition-colors shrink-0">
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      )}

      {/* Remaining flight cards */}
      {!loading &&
        sorted.slice(5).map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
    </div>
  );
}
