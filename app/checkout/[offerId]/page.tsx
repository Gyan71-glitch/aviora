import { Duffel } from "@duffel/api";
import { notFound } from "next/navigation";
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
    const response = await duffel.offers.get(offerId);
    offer = response.data;
  } catch (err) {
    console.error("Failed to fetch offer:", err);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      <Navbar />
      <div className="pt-24 md:pt-32 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-midnight-navy mb-8 tracking-tight">
          Complete your booking
        </h1>
        <CheckoutForm offer={offer} />
      </div>
    </main>
  );
}
