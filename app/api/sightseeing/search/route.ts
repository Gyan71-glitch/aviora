import { NextResponse } from "next/server";
import { mockSightseeingTours } from "@/lib/mock-data/sightseeing";
import { smtPost, smtAuth, smtCurrencyBlock, SMT_ENDPOINTS, logSmtResult } from "@/lib/smt-client";

function normalizeSMTTour(tour: any, index: number) {
  return {
    id: tour.TourId ? `smt-tour-${tour.TourId}` : `tour-smt-${index}`,
    title: tour.TourName || tour.Name || "City Tour",
    image:
      tour.Images?.[0]?.Url ||
      tour.ImageUrl ||
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&q=80",
    city: tour.CityName || "",
    country: tour.CountryName || "",
    durationHours: parseFloat(tour.Duration || "4") || 4,
    rating: parseFloat(tour.Rating || "4.5") || 4.5,
    reviewCount: tour.ReviewCount || Math.floor(Math.random() * 1000) + 100,
    pricePerPerson: Math.round(parseFloat(tour.AdultPrice || tour.Price || "2000")),
    originalPrice: Math.round(parseFloat(tour.AdultPrice || tour.Price || "2000") * 1.2),
    currency: "INR",
    category: tour.TourType?.toLowerCase() || "sightseeing",
    featured: index < 3,
    inclusions: tour.Inclusion?.split(",").map((s: string) => s.trim()).filter(Boolean) || [],
    description: tour.Description || tour.ShortDescription || "",
    smtToken: tour.Token || null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const cityCode = searchParams.get("cityCode") || "";
  const countryCode = searchParams.get("countryCode") || "AE";
  const fromDate =
    searchParams.get("fromDate") ||
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const toDate =
    searchParams.get("toDate") ||
    new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0];
  const adults = parseInt(searchParams.get("adults") || "2");
  const category = searchParams.get("category") || "";

  // SMT Sightseeing search payload
  const smtPayload = {
    SearchRequest: {
      Master: {
        CityCode: cityCode || city.slice(0, 5).toUpperCase() || "DXB",
        CountryCode: countryCode,
        FromDate: fromDate,
        ToDate: toDate,
        Nationality: "IN",
        ResponseMode: "json",
        Mode: "system",
        CityName: city || "Dubai",
        CountryName: "",
        DisplayCountryCityName: city || "Dubai",
        TourDate: null,
        Comp_Curr: "INR",
        Agent_Curr: "INR",
        Gross_Curr: "INR",
        Agent_ROE: 1,
        Gross_ROE: 1,
        LanguageCode: "en",
      },
      IP: "10.0.50.1",
      UserAgent: "Mozilla/5.0",
      Authentication: smtAuth("Sightseeing"),
      Filter: {
        Name: "",
        IncludeTours: false,
        OnRequest: false,
        NoOfResults: "30",
        Desc: true,
        Type: "",
      },
      Adult: adults,
      Child: { Age: [] },
    },
  };

  const { ok, data, error } = await smtPost(
    `${SMT_ENDPOINTS.SIGHTSEEING}/api/GetResult`,
    smtPayload
  );
  logSmtResult("Sightseeing", ok, error);

  let tours: any[] = [];

  if (ok && (data?.Response?.Tours?.Tour?.length > 0 || data?.Result?.length > 0)) {
    const rawTours = data?.Response?.Tours?.Tour || data?.Result || [];
    tours = rawTours.map(normalizeSMTTour);
  } else {
    // Fallback: mock data filtered by city/category
    tours = mockSightseeingTours.filter((tour) => {
      if (city && !tour.city.toLowerCase().includes(city.toLowerCase()) && !tour.title.toLowerCase().includes(city.toLowerCase())) return false;
      if (category && tour.category !== category) return false;
      return true;
    });
  }

  return NextResponse.json({
    success: true,
    total: tours.length,
    tours,
    source: ok ? "smt_live" : "mock",
  });
}
