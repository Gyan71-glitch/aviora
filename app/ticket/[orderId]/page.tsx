import { Duffel } from "@duffel/api";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Plane, CheckCircle, Download, Calendar, Clock, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export default async function TicketPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  let order;
  try {
    const response = await duffel.orders.get(orderId);
    order = response.data;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return notFound();
  }

  const pnr = order.booking_reference;
  const passenger = order.passengers[0];
  const slice = order.slices[0];
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  const airline = order.owner;

  const depDate = new Date(firstSegment.departing_at).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const depTime = firstSegment.departing_at.split("T")[1].substring(0, 5);
  const arrTime = lastSegment.arriving_at.split("T")[1].substring(0, 5);

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      <Navbar />
      <div className="pt-24 md:pt-32 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-midnight-navy tracking-tight">Booking Confirmed!</h1>
          <p className="text-gray-500 mt-2">Your dummy ticket has been issued successfully.</p>
        </div>

        {/* E-Ticket Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
          
          {/* Top colored bar */}
          <div className="h-4 bg-[#3399cc] w-full" />
          
          <div className="p-8 md:p-10">
            {/* Ticket Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                  <Image 
                    src={airline.logo_symbol_url || `https://pics.avs.io/80/80/${airline.iata_code}.png`}
                    alt={airline.name}
                    width={40} height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-midnight-navy">{airline.name}</h2>
                  <p className="text-sm text-gray-400">Flight {firstSegment.operating_carrier.iata_code} {firstSegment.operating_carrier_flight_number}</p>
                </div>
              </div>
              
              <div className="bg-[#f0f4f8] px-6 py-4 rounded-2xl border border-[#e0eaf2] text-center min-w-[160px]">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#3399cc] mb-1">Booking Ref (PNR)</p>
                <p className="text-3xl font-mono font-bold text-midnight-navy">{pnr}</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Passenger Name</p>
                <p className="font-bold text-midnight-navy">{passenger.title.toUpperCase()} {passenger.given_name} {passenger.family_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">E-Ticket Number</p>
                <p className="font-mono font-bold text-midnight-navy">{Math.floor(Math.random() * 9000000000) + 1000000000}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Class</p>
                <p className="font-bold text-midnight-navy">{firstSegment.passengers[0].cabin_class.replace("_", " ").toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Baggage</p>
                <p className="font-bold text-midnight-navy flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-400"/> {firstSegment.passengers[0].baggages?.[0]?.quantity || 1} Checked</p>
              </div>
            </div>

            {/* Flight Route */}
            <div className="bg-[#f8f9fa] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between relative border border-gray-100">
              
              {/* Origin */}
              <div className="text-center md:text-left w-full md:w-1/3">
                <p className="text-4xl font-bold text-midnight-navy tracking-tighter mb-1">{firstSegment.origin.iata_code}</p>
                <p className="text-sm font-semibold text-gray-600 truncate">{firstSegment.origin.city_name || firstSegment.origin.name}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center md:justify-start gap-1"><Clock className="w-3 h-3"/> {depTime}</p>
              </div>

              {/* Path line */}
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center my-6 md:my-0 relative">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest bg-[#f8f9fa] px-3 z-10">{depDate}</p>
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-gray-300 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#3399cc] shadow-sm z-10">
                  <Plane className="w-4 h-4" />
                </div>
              </div>

              {/* Destination */}
              <div className="text-center md:text-right w-full md:w-1/3">
                <p className="text-4xl font-bold text-midnight-navy tracking-tighter mb-1">{lastSegment.destination.iata_code}</p>
                <p className="text-sm font-semibold text-gray-600 truncate">{lastSegment.destination.city_name || lastSegment.destination.name}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center md:justify-end gap-1"><Clock className="w-3 h-3"/> {arrTime}</p>
              </div>
            </div>

          </div>

          {/* Ticket Footer / Perforated edge */}
          <div className="relative flex justify-between items-center bg-[#f0f4f8] p-8 border-t border-dashed border-gray-300">
            {/* Cutout semicircles */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#f8f9fa] rounded-full" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#f8f9fa] rounded-full" />
            
            {/* Barcode Mock */}
            <div className="flex-1 mr-8">
               <div className="h-12 w-full max-w-[300px] opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] repeat-x" />
               <p className="text-[10px] font-mono mt-2 text-gray-500 tracking-[0.2em]">{order.id}</p>
            </div>

            <button className="flex items-center gap-2 bg-midnight-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c2340] hover:shadow-lg transition-all text-sm shrink-0">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
