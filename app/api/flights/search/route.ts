import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      origin = "DEL",
      destination = "BOM",
      date = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      adults = 1,
      cabin = "1",
    } = body;

    // Map legacy UI cabin codes to Duffel cabin classes
    let cabinClass = "economy";
    if (cabin === "3") cabinClass = "premium_economy";
    if (cabin === "4") cabinClass = "business";
    if (cabin === "6") cabinClass = "first";

    console.log(`[Duffel] Searching flights: ${origin} -> ${destination} on ${date}`);

    // Create a live OfferRequest with Duffel
    const offerRequestResponse = await duffel.offerRequests.create({
      slices: [
        {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departure_date: date,
        } as any,
      ],
      passengers: Array.from({ length: adults }).map(() => ({ type: "adult" })),
      cabin_class: cabinClass as any,
      return_offers: true,
    });

    const offers = offerRequestResponse.data.offers;

    const flights = offers.map((offer) => {
      const slice = offer.slices[0];
      const firstSegment = slice.segments[0];
      const lastSegment = slice.segments[slice.segments.length - 1];

      const airline = offer.owner;

      // Parse ISO8601 duration (e.g., PT2H30M)
      const durationMatch = slice.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      let duration = "N/A";
      if (durationMatch) {
        const h = durationMatch[1] || "0";
        const m = durationMatch[2] || "0";
        duration = `${h}h ${m}m`;
      }

      const stops = slice.segments.length - 1;
      const stopCities = slice.segments.slice(1).map((s: any) => s.origin.city_name || s.origin.iata_code);

      // Duffel returns live pricing, often in USD or GBP. Let's do a rough conversion to INR for consistent UI display if needed.
      const price = parseFloat(offer.total_amount);
      let priceInINR = price;
      if (offer.total_currency === "USD") priceInINR = price * 83.5;
      if (offer.total_currency === "GBP") priceInINR = price * 105.2;
      if (offer.total_currency === "EUR") priceInINR = price * 89.4;

      return {
        id: offer.id,
        resultIndex: offer.id,
        airline: {
          code: airline.iata_code,
          name: airline.name,
          // Use Duffel's provided logo if available, else fallback to avs.io
          logo: airline.logo_symbol_url || `https://pics.avs.io/60/60/${airline.iata_code}.png`,
        },
        departure: {
          time: firstSegment.departing_at.split("T")[1].substring(0, 5),
          airport: {
            code: firstSegment.origin.iata_code,
            name: firstSegment.origin.name,
            city: firstSegment.origin.city_name || firstSegment.origin.iata_code,
          },
          date: firstSegment.departing_at,
        },
        arrival: {
          time: lastSegment.arriving_at.split("T")[1].substring(0, 5),
          airport: {
            code: lastSegment.destination.iata_code,
            name: lastSegment.destination.name,
            city: lastSegment.destination.city_name || lastSegment.destination.iata_code,
          },
          date: lastSegment.arriving_at,
        },
        duration,
        stops,
        stopCities,
        price: Math.round(priceInINR),
        cabin: cabinClass,
        // If refund_before_departure is present, it's refundable
        refundable: !!offer.conditions?.refund_before_departure,
      };
    }).sort((a: any, b: any) => a.price - b.price).slice(0, 150); // Top 150 permutations

    return NextResponse.json({
      flights,
      total: offers.length,
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
