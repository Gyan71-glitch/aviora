"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FlightSearchTopBar from "@/components/flights/FlightSearchTopBar";
import FlightSidebar, { FilterState, DEFAULT_FILTERS, parseDuration } from "@/components/flights/FlightSidebar";
import FlightResults from "@/components/flights/FlightResults";
import AIAssistant from "@/components/ui/AIAssistant";
import FlightDateCarousel from "@/components/flights/FlightDateCarousel";
import SpecialFareBanner from "@/components/flights/SpecialFareBanner";
import { FareType } from "@/components/flights/FareTypeSelector";

export interface SearchParams {
  tripType?: "one_way" | "return" | "multi_city";
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  legs?: { origin: string; destination: string; date: string }[];
  adults: number;
  children?: number;
  infants?: number;
  childAges?: string[];
  cabin: string;
  fareType?: string;
  priceDropProtection?: boolean;
}

export interface Flight {
  id: string;
  resultIndex: string;
  tripType?: string;
  slicesCount?: number;
  allSlices?: any[];
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
  tripType: "one_way",
  origin: "DEL",
  destination: "BOM",
  date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  returnDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  adults: 1,
  children: 0,
  infants: 0,
  childAges: [],
  cabin: "Economy",
};

function extractAirportCode(str: string, fallback: string): string {
  if (!str) return fallback;
  const match = str.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  if (str.length === 3) return str.toUpperCase();
  return fallback;
}

function FlightsContent() {
  const urlSearchParams = useSearchParams();

  const [searchParams, setSearchParams] = useState<SearchParams>(() => {
    const tripTypeQuery = (urlSearchParams.get("tripType") || "one_way") as any;
    const fromQuery = urlSearchParams.get("from") || urlSearchParams.get("origin") || "";
    const toQuery = urlSearchParams.get("to") || urlSearchParams.get("destination") || "";
    const todayStr = new Date().toISOString().split("T")[0];
    let dateQuery = urlSearchParams.get("date") || DEFAULT_PARAMS.date;
    if (dateQuery < todayStr) {
      dateQuery = todayStr;
    }
    let returnDateQuery = urlSearchParams.get("returnDate") || DEFAULT_PARAMS.returnDate || "";
    if (returnDateQuery && returnDateQuery < dateQuery) {
      returnDateQuery = new Date(new Date(dateQuery).getTime() + 7 * 86400000).toISOString().split("T")[0];
    }
    
    const adultsQuery = parseInt(urlSearchParams.get("adults") || "1");
    const childrenQuery = parseInt(urlSearchParams.get("children") || "0");
    const infantsQuery = parseInt(urlSearchParams.get("infants") || "0");
    const cabinQuery = urlSearchParams.get("cabin") || DEFAULT_PARAMS.cabin;

    let childAgesQuery: string[] = [];
    const rawChildAges = urlSearchParams.get("childAges");
    if (rawChildAges) {
      try {
        childAgesQuery = JSON.parse(rawChildAges);
      } catch (e) {}
    }

    let legsQuery: any = undefined;
    const legsRaw = urlSearchParams.get("legs");
    if (legsRaw) {
      try {
        legsQuery = JSON.parse(legsRaw);
      } catch (e) {}
    }

    return {
      tripType: tripTypeQuery,
      origin: extractAirportCode(fromQuery, DEFAULT_PARAMS.origin),
      destination: extractAirportCode(toQuery, DEFAULT_PARAMS.destination),
      date: dateQuery,
      returnDate: returnDateQuery,
      legs: legsQuery,
      adults: adultsQuery,
      children: childrenQuery,
      infants: infantsQuery,
      childAges: childAgesQuery,
      cabin: cabinQuery,
    };
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    const fromQuery = urlSearchParams.get("from") || urlSearchParams.get("origin");
    const toQuery = urlSearchParams.get("to") || urlSearchParams.get("destination");
    const legsRaw = urlSearchParams.get("legs");
    const hasPassengerParams = urlSearchParams.has("adults") || urlSearchParams.has("children");

    if (fromQuery || toQuery || legsRaw || hasPassengerParams) {
      const tripTypeQuery = (urlSearchParams.get("tripType") || "one_way") as any;
      let legsQuery: any = undefined;
      if (legsRaw) {
        try {
          legsQuery = JSON.parse(legsRaw);
        } catch (e) {}
      }

      let childAgesQuery: string[] = [];
      const rawChildAges = urlSearchParams.get("childAges");
      if (rawChildAges) {
        try {
          childAgesQuery = JSON.parse(rawChildAges);
        } catch (e) {}
      }

      const parsed: SearchParams = {
        tripType: tripTypeQuery,
        origin: extractAirportCode(fromQuery || "", DEFAULT_PARAMS.origin),
        destination: extractAirportCode(toQuery || "", DEFAULT_PARAMS.destination),
        date: urlSearchParams.get("date") || DEFAULT_PARAMS.date,
        returnDate: urlSearchParams.get("returnDate") || DEFAULT_PARAMS.returnDate,
        legs: legsQuery,
        adults: parseInt(urlSearchParams.get("adults") || "1"),
        children: parseInt(urlSearchParams.get("children") || "0"),
        infants: parseInt(urlSearchParams.get("infants") || "0"),
        childAges: childAgesQuery,
        cabin: urlSearchParams.get("cabin") || DEFAULT_PARAMS.cabin,
      };
      handleSearch(parsed);
    }
  }, [urlSearchParams]);

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
    const ONEWORLD_CODES = ["AA", "BA", "QR", "CX", "QF", "AY", "IB", "JL", "MH", "RJ", "AT", "UL"];
    const SKYTEAM_CODES = ["DL", "AF", "KL", "ME", "SV", "AM", "CI", "GA", "AR", "KQ", "KE", "UX", "RO", "VS"];
    const STAR_ALLIANCE_CODES = ["AI", "LH", "UA", "SQ", "AC", "NH", "ET", "MS", "BR", "NZ", "OS", "SN", "SK", "TP", "TG", "TK", "ZH"];

    return flights.filter((f) => {
      // 1. Stops filter
      if (filters.stops.length > 0) {
        const bucketStop = f.stops >= 2 ? 2 : f.stops;
        if (!filters.stops.includes(bucketStop)) return false;
      }

      // 2. Airports filter (Origin & Destination)
      if (filters.airports.length > 0) {
        const depCode = f.departure.airport.code;
        const arrCode = f.arrival.airport.code;
        if (!filters.airports.includes(depCode) && !filters.airports.includes(arrCode)) {
          return false;
        }
      }

      // 3. Departure Time filter
      if (filters.departTimes.length > 0) {
        const hour = parseInt(f.departure.time.split(":")[0], 10);
        let timeBucket = "night";
        if (hour >= 6 && hour < 12) timeBucket = "morning";
        else if (hour >= 12 && hour < 18) timeBucket = "afternoon";
        else if (hour >= 18 && hour < 24) timeBucket = "evening";

        if (!filters.departTimes.includes(timeBucket)) return false;
      }

      // 4. Arrival Time filter
      if (filters.arrivalTimes.length > 0) {
        const hour = parseInt(f.arrival.time.split(":")[0], 10);
        let timeBucket = "night";
        if (hour >= 6 && hour < 12) timeBucket = "morning";
        else if (hour >= 12 && hour < 18) timeBucket = "afternoon";
        else if (hour >= 18 && hour < 24) timeBucket = "evening";

        if (!filters.arrivalTimes.includes(timeBucket)) return false;
      }

      // 5. Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline.code)) {
        return false;
      }

      // 6. Alliances filter
      if (filters.alliances.length > 0) {
        const code = f.airline.code.toUpperCase();
        let match = false;
        if (filters.alliances.includes("oneworld") && ONEWORLD_CODES.includes(code)) match = true;
        if (filters.alliances.includes("skyteam") && SKYTEAM_CODES.includes(code)) match = true;
        if (filters.alliances.includes("star_alliance") && STAR_ALLIANCE_CODES.includes(code)) match = true;
        if (!match) return false;
      }

      // 7. Stopover Airports filter
      if (filters.stopoverAirports.length > 0) {
        if (!f.stopCities || !f.stopCities.some((city) => filters.stopoverAirports.includes(city))) {
          return false;
        }
      }

      // 8. Cabin filter
      if (filters.cabins.length > 0) {
        const flightCabin = (f.cabin || "economy").toLowerCase();
        if (!filters.cabins.some((c) => c.toLowerCase() === flightCabin || flightCabin.includes(c.toLowerCase()))) {
          return false;
        }
      }

      // 9. Aircraft filter
      if (filters.aircrafts.length > 0) {
        const aircraftName = (f as any).aircraft || (f.airline.code === "AI" ? "Boeing 787 Dreamliner" : "Airbus A320neo");
        if (!filters.aircrafts.includes(aircraftName)) return false;
      }

      // 10. Price filter
      if (filters.maxPrice && f.price > filters.maxPrice) return false;

      // 11. Duration filter
      if (filters.maxDurationMins && parseDuration(f.duration) > filters.maxDurationMins) return false;

      // 12. Refundable filter
      if (filters.refundableOnly && !f.refundable) return false;

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

      <div className="container-aviora py-4">
        {/* MakeMyTrip Lowest Price Date Strip */}
        <FlightDateCarousel
          selectedDate={searchParams.date}
          onSelectDate={(newDate) => {
            handleSearch({ ...searchParams, date: newDate });
          }}
          flights={flights}
        />

        {/* MMT Special Fare Notification Banner */}
        <SpecialFareBanner
          fareType={(searchParams.fareType as FareType) || "regular"}
          onResetToRegular={() => {
            handleSearch({ ...searchParams, fareType: "regular" });
          }}
        />

        <div className="flex flex-col md:flex-row gap-8 items-start mt-2">
          {/* Left Sidebar */}
          <div className="sidebar-card sticky top-[90px] w-full md:w-[240px] shrink-0 max-h-[calc(100vh-110px)] overflow-y-auto scrollbar-thin">
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

    </main>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA] pt-[80px] container-aviora animate-pulse">Loading flights...</div>}>
      <FlightsContent />
    </Suspense>
  );
}
