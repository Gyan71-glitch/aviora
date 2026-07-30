import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, passenger } = body;

    if (!offerId || !passenger) {
      return NextResponse.json({ error: "Missing offerId or passenger" }, { status: 400 });
    }

    console.log(`[Duffel Booking] Fetching offer: ${offerId}`);
    const offerResponse = await duffel.offers.get(offerId);
    const offer = offerResponse.data;

    console.log(`[Duffel Booking] Creating order for passenger: ${passenger.given_name}`);
    
    // Create the actual order in Duffel Sandbox to generate a real PNR
    const orderResponse = await duffel.orders.create({
      type: "instant",
      selected_offers: [offer.id],
      passengers: [
        {
          id: offer.passengers[0].id, // Map the generic passenger ID from the offer
          title: passenger.title,
          given_name: passenger.given_name,
          family_name: passenger.family_name,
          gender: passenger.gender,
          born_on: passenger.born_on,
          email: passenger.email,
          phone_number: passenger.phone_number,
        },
      ],
      // In sandbox, we use 'balance' to instantly pay using test credits
      payments: [
        {
          type: "balance",
          currency: offer.total_currency,
          amount: offer.total_amount,
        },
      ],
    });

    const order = orderResponse.data;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      bookingReference: order.booking_reference, // This is the real PNR!
    });
  } catch (err: any) {
    console.error("[Duffel Booking Error]", err.errors || err);
    const msg = err.errors?.[0]?.message ?? err.message ?? "Failed to book flight";
    return NextResponse.json(
      { error: `Duffel Booking Error: ${msg}` },
      { status: 500 }
    );
  }
}
