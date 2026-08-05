import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripType = "one_way",
      origin = "DEL",
      destination = "BOM",
      date = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      returnDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      legs = [],
      adults = 1,
      children = 0,
      infants = 0,
      childAges = [],
      cabin = "1",
    } = body;

    // Map cabin codes to Duffel cabin classes
    let cabinClass = "economy";
    if (cabin === "3" || cabin === "Premium Economy") cabinClass = "premium_economy";
    if (cabin === "4" || cabin === "Business") cabinClass = "business";
    if (cabin === "6" || cabin === "First") cabinClass = "first";

    // Construct Duffel passenger list according to Duffel API spec
    const passengersList: any[] = [];
    
    // Add Adults
    const numAdults = Math.max(1, parseInt(adults) || 1);
    for (let i = 0; i < numAdults; i++) {
      passengersList.push({ type: "adult" });
    }

    // Add Children (Duffel accepts age parameter for children)
    const numChildren = Math.max(0, parseInt(children) || 0);
    for (let i = 0; i < numChildren; i++) {
      const ageVal = childAges[i] ? parseInt(childAges[i]) : NaN;
      if (!isNaN(ageVal) && ageVal >= 0 && ageVal <= 17) {
        passengersList.push({ age: ageVal });
      } else {
        passengersList.push({ age: 8 });
      }
    }

    // Add Infants on lap
    const numInfants = Math.max(0, parseInt(infants) || 0);
    for (let i = 0; i < numInfants; i++) {
      passengersList.push({ age: 1 });
    }

    // Build Duffel OfferRequest Slices according to tripType
    let slices: any[] = [];

    if (tripType === "multi_city" && Array.isArray(legs) && legs.length > 0) {
      slices = legs.map((leg: any) => ({
        origin: (leg.origin || "DEL").toUpperCase(),
        destination: (leg.destination || "BOM").toUpperCase(),
        departure_date: leg.date || date,
      }));
    } else if (tripType === "return") {
      slices = [
        {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departure_date: date,
        },
        {
          origin: destination.toUpperCase(),
          destination: origin.toUpperCase(),
          departure_date: returnDate || date,
        },
      ];
    } else {
      // One-way (default)
      slices = [
        {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departure_date: date,
        },
      ];
    }

    console.log(`[Duffel] ${tripType.toUpperCase()} search with ${passengersList.length} passenger(s) (${numAdults}A, ${numChildren}C, ${numInfants}I), Cabin: ${cabinClass}`);

    // Create a live OfferRequest with Duffel
    const offerRequestResponse = await duffel.offerRequests.create({
      slices,
      passengers: passengersList,
      cabin_class: cabinClass as any,
      return_offers: true,
    });

    const offers = offerRequestResponse.data.offers;

    const flights = offers.map((offer) => {
      const parsedSlices = offer.slices.map((slice: any, sIdx: number) => {
        const firstSegment = slice.segments[0];
        const lastSegment = slice.segments[slice.segments.length - 1];

        // Parse duration
        const durationMatch = slice.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        let duration = "N/A";
        if (durationMatch) {
          const h = durationMatch[1] || "0";
          const m = durationMatch[2] || "0";
          duration = `${h}h ${m}m`;
        }

        return {
          legIndex: sIdx,
          duration,
          stops: slice.segments.length - 1,
          stopCities: slice.segments.slice(1).map((s: any) => s.origin.city_name || s.origin.iata_code),
          departure: {
            time: firstSegment.departing_at.split("T")[1].substring(0, 5),
            date: firstSegment.departing_at,
            airport: {
              code: firstSegment.origin.iata_code,
              name: firstSegment.origin.name,
              city: firstSegment.origin.city_name || firstSegment.origin.iata_code,
            },
          },
          arrival: {
            time: lastSegment.arriving_at.split("T")[1].substring(0, 5),
            date: lastSegment.arriving_at,
            airport: {
              code: lastSegment.destination.iata_code,
              name: lastSegment.destination.name,
              city: lastSegment.destination.city_name || lastSegment.destination.iata_code,
            },
          },
        };
      });

      const firstSlice = parsedSlices[0];
      const airline = offer.owner;

      // Currency Conversion to INR
      const price = parseFloat(offer.total_amount);
      let priceInINR = price;
      if (offer.total_currency === "USD") priceInINR = price * 83.5;
      if (offer.total_currency === "GBP") priceInINR = price * 105.2;
      if (offer.total_currency === "EUR") priceInINR = price * 89.4;

      return {
        id: offer.id,
        resultIndex: offer.id,
        tripType,
        slicesCount: parsedSlices.length,
        airline: {
          code: airline.iata_code,
          name: airline.name,
          logo: airline.logo_symbol_url || `https://pics.avs.io/60/60/${airline.iata_code}.png`,
        },
        departure: firstSlice.departure,
        arrival: parsedSlices[parsedSlices.length - 1].arrival,
        duration: firstSlice.duration,
        stops: firstSlice.stops,
        stopCities: firstSlice.stopCities,
        allSlices: parsedSlices,
        price: Math.round(priceInINR),
        cabin: cabinClass,
        refundable: !!offer.conditions?.refund_before_departure,
      };
    }).sort((a: any, b: any) => a.price - b.price).slice(0, 150);

    return NextResponse.json({
      success: true,
      flights,
      total: offers.length,
      tripType,
      traceId: offerRequestResponse.data.id,
    });
  } catch (err: any) {
    console.error("[Duffel Search Error]", err.errors || err);
    const msg = err.errors?.[0]?.message ?? err.message ?? "Internal server error";
    return NextResponse.json(
      { error: `Duffel API Error: ${msg}` },
      { status: 500 }
    );
  }
}
