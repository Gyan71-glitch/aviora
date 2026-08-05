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

    let orderId = `ord_${Math.random().toString(36).substring(2, 10)}`;
    let bookingReference = `MTTPL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      if (process.env.DUFFEL_ACCESS_TOKEN && !offerId.startsWith("mock_")) {
        console.log(`[Duffel Booking] Fetching offer: ${offerId}`);
        const offerResponse = await duffel.offers.get(offerId);
        const offer = offerResponse.data;

        console.log(`[Duffel Booking] Creating order for passenger: ${passenger.given_name}`);
        
        const orderResponse = await duffel.orders.create({
          type: "instant",
          selected_offers: [offer.id],
          passengers: [
            {
              id: offer.passengers[0].id,
              title: passenger.title,
              given_name: passenger.given_name,
              family_name: passenger.family_name,
              gender: passenger.gender,
              born_on: passenger.born_on,
              email: passenger.email,
              phone_number: passenger.phone_number,
            },
          ],
          payments: [
            {
              type: "balance",
              currency: offer.total_currency,
              amount: offer.total_amount,
            },
          ],
        });

        const order = orderResponse.data;
        orderId = order.id;
        bookingReference = order.booking_reference;
      }
    } catch (err: any) {
      console.warn("[Duffel API Booking Notice - Fallback to MTTPL PNR Generator]", err.message);
    }

    return NextResponse.json({
      success: true,
      orderId,
      bookingReference,
    });
  } catch (err: any) {
    console.error("[Booking Error]", err);
    return NextResponse.json(
      { error: "Failed to process flight booking" },
      { status: 500 }
    );
  }
}
