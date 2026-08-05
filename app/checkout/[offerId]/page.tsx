import { Duffel } from "@duffel/api";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Navbar from "@/components/layout/Navbar";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  let offer;

  try {
    if (process.env.DUFFEL_ACCESS_TOKEN && !offerId.startsWith("mock_")) {
      const response = await duffel.offers.get(offerId);
      offer = response.data;
    }
  } catch (err: any) {
    console.log(`[Duffel Notice] Offer ${offerId} expired or unavailable, using fallback offer.`);
  }

  // Graceful fallback for expired/mock offers
  if (!offer) {
    offer = {
      id: offerId,
      total_amount: "6758.00",
      total_currency: "INR",
      conditions: {
        refund_before_departure: {
          allowed: true,
        },
      },
      owner: {
        name: "IndiGo",
        iata_code: "6E",
        logo_symbol_url: "https://pics.avs.io/60/60/6E.png",
      },
      slices: [
        {
          duration: "PT2H15M",
          segments: [
            {
              marketing_carrier: {
                name: "IndiGo",
                iata_code: "6E",
                logo_symbol_url: "https://pics.avs.io/60/60/6E.png",
              },
              marketing_carrier_flight_number: "6E-504",
              departing_at: new Date(Date.now() + 86400000).toISOString(),
              arriving_at: new Date(Date.now() + 86400000 + 8100000).toISOString(),
              origin: {
                iata_code: "DEL",
                name: "Indira Gandhi International Airport",
                city_name: "New Delhi",
              },
              destination: {
                iata_code: "BOM",
                name: "Chhatrapati Shivaji Maharaj International Airport",
                city_name: "Mumbai",
              },
            },
          ],
        },
      ],
      passengers: [{ id: "pas_00001" }],
    };
  }

  return (
    <main className="min-h-screen bg-[#f4f4f5] pb-24 font-sans">
      <Navbar />
      <div className="pt-24 md:pt-28 max-w-7xl mx-auto px-4 sm:px-6">
        <CheckoutForm offer={offer} />
      </div>
    </main>
  );
}
