"use client";

import { useState, useMemo } from "react";
import FlightSearchTopBar from "@/components/flights/FlightSearchTopBar";
import FlightSidebar, { FilterState, DEFAULT_FILTERS } from "@/components/flights/FlightSidebar";
import FlightResults from "@/components/flights/FlightResults";
import AIAssistant from "@/components/ui/AIAssistant";

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  adults: number;
  cabin: string;
}

export interface Flight {
  id: string;
  resultIndex: string;
  airline: { code: string; name: string; logo: string };
  departure: { time: string; airport: { code: string; name: string; city: string }; date: string };
  arrival: { time: string; airport: { code: string; name: string; city: string }; date: string };
  duration: string;
  stops: number;
  stopCities: string[];
  price: number;
  cabin: string;
  refundable: boolean;
}

const DEFAULT_PARAMS: SearchParams = {
  origin: "DEL",
  destination: "BOM",
  date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  adults: 1,
  cabin: "1",
};

function parseDuration(dur: string): number {
  if (!dur || dur === "N/A") return 9999;
  const m = dur.match(/(\d+)h\s*(\d+)m/);
  if (!m) return 9999;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setLoading(true);
    setError(null);
    setSearched(true);
    setFilters(DEFAULT_FILTERS); // reset filters on new search

    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Search failed. Please try again.");
      }

      setFlights(data.flights ?? []);
      setTotal(data.total ?? 0);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Apply sidebar filters to produce the visible flight list ─────────────
  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      // Stops filter
      if (filters.stops.length > 0) {
        const bucketStop = f.stops >= 2 ? 2 : f.stops;
        if (!filters.stops.includes(bucketStop)) return false;
      }

      // Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline.code)) {
        return false;
      }

      // Price filter
      if (f.price > filters.maxPrice) return false;

      // Duration filter
      if (parseDuration(f.duration) > filters.maxDurationMins) return false;

      // Refundable filter
      if (filters.refundable !== null && f.refundable !== filters.refundable) return false;

      return true;
    });
  }, [flights, filters]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] font-sans text-midnight-navy pt-[80px]">
      {/* Sticky search bar */}
      <FlightSearchTopBar
        params={searchParams}
        onSearch={handleSearch}
        loading={loading}
      />

      <div className="container-aviora py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <div className="sidebar-card sticky top-[140px] w-full md:w-[240px] shrink-0 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
            <FlightSidebar
              flights={flights}
              filters={filters}
              onFiltersChange={setFilters}
              filteredCount={filteredFlights.length}
            />
          </div>

          {/* Main Results — receives the FILTERED list */}
          <div className="flex-1 min-w-0">
            <FlightResults
              flights={filteredFlights}
              loading={loading}
              error={error}
              total={total}
              searched={searched}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>

      <AIAssistant />
    </main>
  );
}
