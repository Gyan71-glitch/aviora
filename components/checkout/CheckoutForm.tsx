"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RazorpayModal from "./RazorpayModal";
import { 
  User, Mail, Phone, Calendar, Loader2, Plane, ShieldAlert, 
  BadgePercent, Check, ArrowRight, ShieldCheck, Ticket, Building2, 
  Smartphone, Shield, Plus, Lock, Info, RefreshCw, Luggage, Utensils, Armchair, ChevronDown, ChevronUp, ArrowLeft, X
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  offer: any;
}

export default function CheckoutForm({ offer }: Props) {
  const router = useRouter();

  // Navigation Steps: 1 = Review & Traveller Details, 2 = Seats & Meals
  const [step, setStep] = useState<1 | 2>(1);

  // Scroll to top of page whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const [addonsTab, setAddonsTab] = useState<"seats" | "meals">("seats");
  const [mealFilter, setMealFilter] = useState<"all" | "veg" | "nonveg">("all");

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  // Tabs for Policy breakdown
  const [policyTab, setPolicyTab] = useState<"cancellation" | "datechange" | "baggage">("cancellation");

  // Insurance & Protection State
  const [tripProtection, setTripProtection] = useState(true);
  const [mttplAssured, setMttplAssured] = useState(false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Seat & Meal Selection State
  const [selectedSeat, setSelectedSeat] = useState<{ number: string; price: number } | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<{ id: string; title: string; price: number } | null>(null);

  const [needWheelchair, setNeedWheelchair] = useState(false);
  const [frequentFlyerNo, setFrequentFlyerNo] = useState("");

  // Billing & GST State
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [billingState, setBillingState] = useState("Delhi");

  const STATES = [
    "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", 
    "Haryana", "Uttar Pradesh", "Gujarat", "Rajasthan", "Telangana",
    "Goa", "Punjab", "Kerala", "Madhya Pradesh", "Bihar"
  ];

  const [formData, setFormData] = useState({
    title: "mr",
    given_name: "John",
    family_name: "Doe",
    gender: "m",
    born_on: "1990-01-01",
    email: "john.doe@example.com",
    phone_number: "+919876543210"
  });

  // Extract Flight Segment Data from Duffel Offer
  const slice = offer.slices?.[0];
  const segment = slice?.segments?.[0];
  const airline = offer.owner || segment?.marketing_carrier;
  const airlineName = airline?.name || "Airline";
  const airlineCode = airline?.iata_code || "";
  const logoUrl = airline?.logo_symbol_url || `https://pics.avs.io/60/60/${airlineCode}.png`;
  const flightNumber = segment?.marketing_carrier_flight_number || segment?.operating_carrier_flight_number || "101";

  const depCode = segment?.origin?.iata_code || "DEL";
  const depName = segment?.origin?.name || "Indira Gandhi International Airport";
  const depCity = segment?.origin?.city_name || segment?.origin?.city?.name || depCode;
  
  // Format times/dates
  const depTime = segment?.departing_at 
    ? new Date(segment.departing_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) 
    : "00:00";
  const depDate = segment?.departing_at 
    ? new Date(segment.departing_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) 
    : "";

  const arrCode = segment?.destination?.iata_code || "BOM";
  const arrName = segment?.destination?.name || "Chhatrapati Shivaji Maharaj International Airport";
  const arrCity = segment?.destination?.city_name || segment?.destination?.city?.name || arrCode;
  
  const arrTime = segment?.arriving_at 
    ? new Date(segment.arriving_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) 
    : "00:00";
  const arrDate = segment?.arriving_at 
    ? new Date(segment.arriving_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) 
    : "";

  // Parse duration
  const durationMatch = slice?.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  let duration = "N/A";
  if (durationMatch) {
    const h = durationMatch[1] || "0";
    const m = durationMatch[2] || "0";
    duration = `${h}h ${m}m`;
  }

  // Base Prices in INR
  const rawPrice = parseFloat(offer.total_amount);
  let priceInINR = rawPrice;
  if (offer.total_currency === "USD") priceInINR = rawPrice * 83.5;
  if (offer.total_currency === "GBP") priceInINR = rawPrice * 105.2;
  if (offer.total_currency === "EUR") priceInINR = rawPrice * 89.4;
  const initialAmount = Math.round(priceInINR);

  // Available coupons
  const COUPONS = [
    { code: "MTTPLSUPER", discount: 225, description: "Get flat ₹225 off on flights" },
    { code: "FREESEAT", discount: 350, description: "Use code FREESEAT to get a free seat (up to 350)" },
    { code: "FREEMEAL", discount: 350, description: "Use code FREEMEAL to get a free meal (up to 350)" },
    { code: "AVIORAPLUS", discount: 500, description: "Aviora Special: flat ₹500 off" }
  ];

  const handleApplyCoupon = (code: string) => {
    setCouponError("");
    const matched = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (matched) {
      setAppliedDiscount(matched.discount);
      setAppliedCode(matched.code);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try another one!");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(0);
    setAppliedCode(null);
  };

  const protectionFee = tripProtection ? 199 : 0;
  const assuredFee = mttplAssured ? 399 : 0;
  const seatFee = selectedSeat ? selectedSeat.price : 0;
  const mealFee = selectedMeal ? selectedMeal.price : 0;

  const finalAmount = Math.max(100, initialAmount + protectionFee + assuredFee + seatFee + mealFee - appliedDiscount);

  const handlePaymentSuccess = async (paymentId: string) => {
    setShowRazorpay(false);
    setIsBooking(true);

    try {
      const res = await fetch("/api/flights/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          passenger: formData,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      router.push(`/ticket/${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
      setIsBooking(false);
    }
  };

  // Food Menu Items matching MakeMyTrip
  const MEALS = [
    { id: "m1", title: "Christopher Hot Chocolate", price: 101, type: "veg", cat: "Combos", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80" },
    { id: "m2", title: "Navroz Special (Non-Veg)", price: 551, type: "nonveg", cat: "Combos", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
    { id: "m3", title: "Peppy Paneer Sandwich", price: 551, type: "veg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80" },
    { id: "m4", title: "Mushroom & Brie Croissant", price: 551, type: "veg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80" },
    { id: "m5", title: "Triple Treat Nutella Sandwich", price: 601, type: "veg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80" },
    { id: "m6", title: "Kosha Chicken Malabari Wrapper", price: 601, type: "nonveg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&q=80" },
    { id: "m7", title: "Chicken & Cheese Sandwich", price: 450, type: "nonveg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&q=80" },
    { id: "m8", title: "QP Chicken Club Croissant", price: 500, type: "nonveg", cat: "Sandwiches & Wraps", img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80" }
  ];

  // Helper for generating seat price / status
  const getSeatInfo = (row: number, col: string) => {
    // Occupied seats
    if ([2, 4, 6, 8, 12, 18, 29].includes(row) && ["A", "B", "E"].includes(col)) {
      return { price: 0, occupied: true, tier: "occupied" };
    }
    // Free seats rows 30 to 33
    if (row >= 30) {
      return { price: 0, occupied: false, tier: "free" };
    }
    // Premium front seats (rows 1-5)
    if (row <= 5) {
      return { price: 700, occupied: false, tier: "purple" };
    }
    // Standard rows (6-29)
    return { price: 350, occupied: false, tier: "blue" };
  };

  if (isBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border border-slate-200/80 rounded-[32px] p-12 text-center max-w-2xl mx-auto shadow-xs font-sans">
        <Loader2 className="w-14 h-14 text-amber-500 animate-spin mb-6" />
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Confirming your booking...</h2>
        <p className="text-slate-500 mt-2 font-medium">Generating PNR with the airline. Please do not close or refresh this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Steps Bar (MMT Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest block mb-1">MTTPL Checkout</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Review Your Booking" : "Seats & Meals Selection"}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span 
            onClick={() => setStep(1)}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all ${
              step === 1 ? "text-blue-600 bg-blue-50 border border-blue-200 font-extrabold" : "text-slate-700 bg-white border border-slate-200"
            }`}
          >
            1. Details
          </span>
          <span className="text-slate-300">→</span>
          <span 
            onClick={() => { setStep(2); setAddonsTab("seats"); }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all ${
              step === 2 && addonsTab === "seats" ? "text-blue-600 bg-blue-50 border border-blue-200 font-extrabold" : "text-slate-700 bg-white border border-slate-200"
            }`}
          >
            2. Seats
          </span>
          <span className="text-slate-300">→</span>
          <span 
            onClick={() => { setStep(2); setAddonsTab("meals"); }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all ${
              step === 2 && addonsTab === "meals" ? "text-blue-600 bg-blue-50 border border-blue-200 font-extrabold" : "text-slate-700 bg-white border border-slate-200"
            }`}
          >
            3. Meals
          </span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">4. Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* STEP 1: Flight Summary & Traveller Details */}
        {step === 1 && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Flight Details Card (MMT Style) */}
            <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-sm uppercase tracking-wider">Flight Details</span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    {offer.conditions?.refund_before_departure ? "REFUNDABLE" : "NON-REFUNDABLE"}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {depCity} to {arrCity}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-xl border border-slate-100 bg-white flex items-center justify-center p-1">
                      <Image
                        src={logoUrl}
                        alt={airlineName}
                        width={36}
                        height={36}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {airlineName}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400">
                        {airlineCode}-{flightNumber} · Economy
                      </p>
                    </div>
                  </div>

                  {/* Time Segments */}
                  <div className="flex-1 max-w-md flex items-center justify-between text-slate-700">
                    <div className="text-left">
                      <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">DEPART</span>
                      <span className="text-lg font-black text-slate-900 leading-none">{depTime}</span>
                      <span className="text-xs font-bold text-slate-500 block mt-1">{depDate}</span>
                      <span className="text-[10px] font-bold text-slate-400 block truncate max-w-[120px]">{depName}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 shrink-0 px-4">
                      <span className="text-[10px] font-black text-slate-400">{duration}</span>
                      <div className="flex items-center gap-1 w-20">
                        <div className="flex-1 h-px bg-slate-200" />
                        <Plane className="w-3.5 h-3.5 text-slate-300 rotate-90" />
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">Non-stop</span>
                    </div>

                    <div className="text-left">
                      <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">ARRIVE</span>
                      <span className="text-lg font-black text-slate-900 leading-none">{arrTime}</span>
                      <span className="text-xs font-bold text-slate-500 block mt-1">{arrDate}</span>
                      <span className="text-[10px] font-bold text-slate-400 block truncate max-w-[120px]">{arrName}</span>
                    </div>
                  </div>
                </div>

                {/* Baggage Info Banner */}
                <div className="flex items-center gap-6 text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">CABIN BAGGAGE</span>
                    <span>7 Kgs (1 piece per adult)</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">CHECK-IN BAGGAGE</span>
                    <span>15 Kgs (1 piece per adult)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation & Date Change Policy Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">Cancellation & Date Change Policy</h3>
                </div>
              </div>

              {/* Policy Navigation Tabs */}
              <div className="flex border-b border-slate-100 gap-6">
                <button
                  onClick={() => setPolicyTab("cancellation")}
                  className={`pb-3 text-xs font-black transition-colors relative border-b-2 ${
                    policyTab === "cancellation"
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-400 border-transparent hover:text-slate-700"
                  }`}
                >
                  Cancellation Policy
                </button>
                <button
                  onClick={() => setPolicyTab("datechange")}
                  className={`pb-3 text-xs font-black transition-colors relative border-b-2 ${
                    policyTab === "datechange"
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-400 border-transparent hover:text-slate-700"
                  }`}
                >
                  Date Change Policy
                </button>
                <button
                  onClick={() => setPolicyTab("baggage")}
                  className={`pb-3 text-xs font-black transition-colors relative border-b-2 ${
                    policyTab === "baggage"
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-400 border-transparent hover:text-slate-700"
                  }`}
                >
                  Baggage Rules
                </button>
              </div>

              {/* Policy Tab Contents */}
              {policyTab === "cancellation" && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500">Timeline & Refund charges per passenger:</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1 text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MORE THAN 4 HOURS BEFORE</span>
                      <p className="text-sm font-black text-rose-600">₹ 3,500 fee</p>
                      <p className="text-[11px] font-semibold text-slate-500">Refundable = Base fare + Taxes minus penalty</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1 text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WITHIN 4 HOURS OF DEPARTURE</span>
                      <p className="text-sm font-black text-rose-600">Non-refundable</p>
                      <p className="text-[11px] font-semibold text-slate-500">Zero refund applicable on no-show</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1 text-left">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">CANCELLATION BY AIRLINE</span>
                      <p className="text-sm font-black text-emerald-800">100% Refund</p>
                      <p className="text-[11px] font-semibold text-emerald-700">Full refund processed to original source</p>
                    </div>
                  </div>
                </div>
              )}

              {policyTab === "datechange" && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500">Rescheduling & Fare Difference charges per passenger:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1 text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MORE THAN 4 HOURS BEFORE</span>
                      <p className="text-sm font-black text-blue-600">₹ 2,500 + Fare Diff</p>
                      <p className="text-[11px] font-semibold text-slate-500">Subject to seat availability on target date</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1 text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WITHIN 4 HOURS OF DEPARTURE</span>
                      <p className="text-sm font-black text-rose-600">Not Allowed</p>
                      <p className="text-[11px] font-semibold text-slate-500">No rescheduling permitted within departure window</p>
                    </div>
                  </div>
                </div>
              )}

              {policyTab === "baggage" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-black text-slate-800 uppercase">Cabin Baggage</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">7 Kgs (1 Piece)</p>
                    <p className="text-[11px] font-medium text-slate-500">Dimensions should not exceed 115cm (L+W+H)</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-800 uppercase">Check-in Baggage</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">15 Kgs (1 Piece)</p>
                    <p className="text-[11px] font-medium text-slate-500">Excess baggage charged @ ₹500/kg at airport counter</p>
                  </div>
                </div>
              )}
            </div>

            {/* MTTPL Assured Refund Protection Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">MTTPL Assured Refund Protection</h3>
                </div>
                <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  ₹399 / traveller
                </span>
              </div>

              <div 
                onClick={() => setMttplAssured(!mttplAssured)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  mttplAssured
                    ? "bg-amber-50/50 border-amber-300 shadow-xs"
                    : "bg-white border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={mttplAssured}
                  onChange={() => setMttplAssured(!mttplAssured)}
                  className="mt-1 text-amber-600 focus:ring-amber-500 rounded border-slate-300"
                />
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-slate-900">Add MTTPL 100% Instant Refund Guarantee</p>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                    Get full 100% refund of your booking amount in case you cancel up to 24 hours prior to departure. No questions asked.
                  </p>
                </div>
              </div>
            </div>

            {/* Trip Protection Card (MMT Style) */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">Trip Insurance</h3>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ₹199 / traveller
                </span>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => setTripProtection(true)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    tripProtection
                      ? "bg-emerald-50/50 border-emerald-300 shadow-xs"
                      : "bg-white border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="protection"
                    checked={tripProtection}
                    onChange={() => setTripProtection(true)}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-extrabold text-slate-900">Yes, Secure my trip (Recommended)</p>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">Highly Popular</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                      Cover medical emergency expenses up to ₹1,00,000, flight delay reimbursement up to ₹2,500 & lost baggage support.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setTripProtection(false)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    !tripProtection
                      ? "bg-slate-100 border-slate-300"
                      : "bg-white border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="protection"
                    checked={!tripProtection}
                    onChange={() => setTripProtection(false)}
                    className="mt-1 text-slate-600 focus:ring-slate-500"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-slate-700">No, I will risk my travel</p>
                    <p className="text-[11px] font-semibold text-slate-400">
                      I understand I will not be reimbursed for unforeseen flight delays or lost luggage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-5 flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900 leading-tight">Important Traveller Name Policy</h4>
                <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                  Please guarantee that the passenger's first name and last name match their government-issued identity documents (Passport, Aadhar, Driving License) exactly. The airline does not permit post-booking name modifications.
                </p>
              </div>
            </div>

            {/* Passenger Details Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">Passenger Details</h3>
                </div>
                <span className="text-xs font-extrabold text-slate-400">Adult 1</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                  <select 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    <option value="mr">Mr</option>
                    <option value="ms">Ms</option>
                    <option value="mrs">Mrs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={formData.given_name} 
                    onChange={e => setFormData({...formData, given_name: e.target.value})}
                    placeholder="As per Government ID"
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-850 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.family_name} 
                    onChange={e => setFormData({...formData, family_name: e.target.value})}
                    placeholder="As per Government ID"
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-850 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400"/> Date of Birth
                  </label>
                  <input 
                    type="date" 
                    value={formData.born_on} 
                    onChange={e => setFormData({...formData, born_on: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Frequent Flyer No. (Optional)</label>
                  <input 
                    type="text" 
                    value={frequentFlyerNo} 
                    onChange={e => setFrequentFlyerNo(e.target.value)}
                    placeholder="e.g. AI-987654"
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needWheelchair}
                      onChange={(e) => setNeedWheelchair(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Request Wheelchair Assistance</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Mail className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">Contact Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-850 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400"/> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone_number} 
                    onChange={e => setFormData({...formData, phone_number: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-850 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-700">
                  Send booking confirmation & PNR updates on WhatsApp
                </span>
              </label>
            </div>

            {/* GST & Billing State Details Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider">Billing & State Details</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State of Residence</label>
                  <select
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasGST}
                      onChange={(e) => setHasGST(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">I have a GST number (Optional)</span>
                  </label>
                </div>
              </div>

              {hasGST && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">GST Registration No.</label>
                    <input
                      type="text"
                      placeholder="22AAAAA0000A1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="Pvt Ltd / Enterprise"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* CONTINUE CTA Button at bottom of Left Details Column */}
            <div className="pt-2">
              <button 
                onClick={() => {
                  if (!formData.given_name.trim() || !formData.family_name.trim()) {
                    alert("Please fill in the passenger First Name and Last Name.");
                    return;
                  }
                  setStep(2);
                }}
                className="w-full md:w-auto btn-gold px-10 py-4 rounded-2xl font-black text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all cursor-pointer text-center uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO SEATS & MEALS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Seats & Meals Add-ons Selection (MMT Style) */}
        {step === 2 && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Add-ons Nav Header */}
            <div className="bg-white rounded-[28px] border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setAddonsTab("seats")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                    addonsTab === "seats"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Armchair className="w-4 h-4 text-emerald-400" />
                  <span>💺 Seats</span>
                </button>

                <button
                  onClick={() => setAddonsTab("meals")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                    addonsTab === "meals"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>🍱 Meals</span>
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:underline px-3 py-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Details</span>
              </button>
            </div>

            {/* SEATS TAB: Interactive Airplane Fuselage Seat Map */}
            {addonsTab === "seats" && (
              <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                
                {/* Coupon Code Top Banner */}
                <div className="bg-emerald-50 text-emerald-950 px-6 py-3 border-b border-emerald-200 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <span>Use code <strong className="text-emerald-700 font-black">FREESEAT</strong> to get a free seat (up to ₹350)</span>
                  </div>
                  <button onClick={() => handleApplyCoupon("FREESEAT")} className="text-[10px] font-black text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg">APPLY</button>
                </div>

                {/* Route & Selection Banner */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{depCity} → {arrCity}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {selectedSeat ? `1 of 1 Seat Selected: Seat ${selectedSeat.number}` : "0 of 1 Seat(s) Selected"}
                    </p>
                  </div>

                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    selectedSeat ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}>
                    {selectedSeat ? `Seat ${selectedSeat.number} (+₹${selectedSeat.price})` : "Selection pending"}
                  </span>
                </div>

                {/* AIRPLANE SEAT MAP GRAPHIC CONTAINER */}
                <div className="bg-[#bce4fa] p-8 flex flex-col items-center relative overflow-hidden min-h-[600px]">
                  
                  {/* Airplane Cockpit Nosecone */}
                  <div className="w-72 h-36 bg-white rounded-t-[140px] border-t-4 border-slate-200 flex flex-col items-center justify-center relative shadow-sm mb-4">
                    <div className="flex gap-6 mt-6">
                      <div className="w-12 h-6 bg-slate-800 rounded-tl-full rounded-tr-sm rotate-[-12deg]" />
                      <div className="w-12 h-6 bg-slate-800 rounded-tr-full rounded-tl-sm rotate-[12deg]" />
                    </div>
                  </div>

                  {/* Seat Grid Layout (Fuselage Body) */}
                  <div className="w-80 bg-white border-x-8 border-slate-200 px-4 py-6 rounded-b-3xl shadow-sm space-y-3">
                    
                    {/* Column Headers */}
                    <div className="flex justify-between items-center px-2 text-xs font-black text-slate-400 mb-4 border-b border-slate-100 pb-2">
                      <div className="flex gap-2"><span>A</span><span>B</span><span>C</span></div>
                      <span className="text-[10px]">AISLE</span>
                      <div className="flex gap-2"><span>D</span><span>E</span><span>F</span></div>
                    </div>

                    {/* Seat Rows 1 to 33 */}
                    {Array.from({ length: 33 }).map((_, rIdx) => {
                      const rowNum = rIdx + 1;
                      return (
                        <div key={rowNum} className="flex justify-between items-center">
                          {/* Left Seats A, B, C */}
                          <div className="flex gap-1.5">
                            {["A", "B", "C"].map((col) => {
                              const seatId = `${rowNum}${col}`;
                              const info = getSeatInfo(rowNum, col);
                              const isSelected = selectedSeat?.number === seatId;

                              let bgStyle = "bg-sky-200 border-sky-300 text-sky-900";
                              if (info.tier === "purple") bgStyle = "bg-purple-200 border-purple-300 text-purple-900";
                              if (info.tier === "free") bgStyle = "bg-emerald-400 border-emerald-500 text-emerald-950 font-black";
                              if (info.occupied) bgStyle = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed";
                              if (isSelected) bgStyle = "bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-400";

                              return (
                                <button
                                  key={seatId}
                                  disabled={info.occupied}
                                  onClick={() => setSelectedSeat({ number: seatId, price: info.price })}
                                  className={`w-7 h-7 rounded-lg border text-[9px] font-extrabold flex items-center justify-center transition-all ${bgStyle}`}
                                >
                                  {info.occupied ? "X" : isSelected ? "✓" : info.price === 0 ? "₹0" : seatId}
                                </button>
                              );
                            })}
                          </div>

                          {/* Row Number */}
                          <span className="text-[10px] font-black text-slate-400 w-6 text-center">{rowNum}</span>

                          {/* Right Seats D, E, F */}
                          <div className="flex gap-1.5">
                            {["D", "E", "F"].map((col) => {
                              const seatId = `${rowNum}${col}`;
                              const info = getSeatInfo(rowNum, col);
                              const isSelected = selectedSeat?.number === seatId;

                              let bgStyle = "bg-sky-200 border-sky-300 text-sky-900";
                              if (info.tier === "purple") bgStyle = "bg-purple-200 border-purple-300 text-purple-900";
                              if (info.tier === "free") bgStyle = "bg-emerald-400 border-emerald-500 text-emerald-950 font-black";
                              if (info.occupied) bgStyle = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed";
                              if (isSelected) bgStyle = "bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-400";

                              return (
                                <button
                                  key={seatId}
                                  disabled={info.occupied}
                                  onClick={() => setSelectedSeat({ number: seatId, price: info.price })}
                                  className={`w-7 h-7 rounded-lg border text-[9px] font-extrabold flex items-center justify-center transition-all ${bgStyle}`}
                                >
                                  {info.occupied ? "X" : isSelected ? "✓" : info.price === 0 ? "₹0" : seatId}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Airplane Wings Graphic */}
                  <div className="w-[460px] h-12 bg-white border-2 border-slate-200 rounded-full my-4 shadow-sm" />

                  {/* Airplane Tail Fins Graphic */}
                  <div className="flex items-center gap-12 mt-2">
                    <div className="w-16 h-28 bg-red-600 rounded-tl-full rounded-br-full shadow-md" />
                    <div className="w-8 h-20 bg-slate-300 rounded-b-xl" />
                    <div className="w-16 h-28 bg-red-600 rounded-tr-full rounded-bl-full shadow-md" />
                  </div>

                  {/* Legend Overlay Card */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg text-[11px] font-bold space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-400 rounded border border-emerald-500" />
                      <span>Free Seats (₹0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-sky-200 rounded border border-sky-300" />
                      <span>Standard Seats (₹250 - ₹550)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-200 rounded border border-purple-300" />
                      <span>Premium Front Seats (₹700 - ₹5500)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-100 rounded border border-slate-200 text-center text-[9px] text-slate-400">X</div>
                      <span>Occupied / Reserved</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer: Go from Seats -> Meals */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setAddonsTab("meals");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn-gold px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center gap-2"
                  >
                    <span>CONTINUE TO MEALS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setAddonsTab("meals");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-extrabold text-slate-500 hover:text-blue-600 hover:underline"
                  >
                    Skip seat selection →
                  </button>
                </div>
              </div>
            )}

            {/* MEALS TAB: Food Selection Menu */}
            {addonsTab === "meals" && (
              <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs p-6 space-y-6">
                
                {/* Coupon Top Banner */}
                <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span>Use code <strong className="text-emerald-700 font-black">FREEMEAL</strong> to get a free meal (up to ₹350)</span>
                  </div>
                  <button onClick={() => handleApplyCoupon("FREEMEAL")} className="text-[10px] font-black text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg">APPLY</button>
                </div>

                {/* Meal Filters */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMealFilter("all")}
                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        mealFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setMealFilter("veg")}
                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        mealFilter === "veg" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      <div className="w-2.5 h-2.5 border border-emerald-600 rounded-sm flex items-center justify-center p-0.5"><div className="w-1 h-1 bg-emerald-600 rounded-full" /></div>
                      <span>Veg</span>
                    </button>
                    <button
                      onClick={() => setMealFilter("nonveg")}
                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        mealFilter === "nonveg" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      <div className="w-2.5 h-2.5 border border-rose-600 rounded-sm flex items-center justify-center p-0.5"><div className="w-1 h-1 bg-rose-600 rounded-full" /></div>
                      <span>Non-Veg</span>
                    </button>
                  </div>

                  <span className="text-xs font-extrabold text-amber-600">
                    {selectedMeal ? `Selected: ${selectedMeal.title} (+₹${selectedMeal.price})` : "Select your meal"}
                  </span>
                </div>

                {/* Food Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEALS.filter(m => mealFilter === "all" || m.type === mealFilter).map((meal) => {
                    const isSelected = selectedMeal?.id === meal.id;

                    return (
                      <div 
                        key={meal.id}
                        className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                          isSelected ? "bg-amber-50 border-amber-400 shadow-xs" : "bg-white border-slate-200/80 hover:border-blue-200"
                        }`}
                      >
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 bg-slate-100">
                          <Image src={meal.img} alt={meal.title} fill className="object-cover" />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 border rounded-sm flex items-center justify-center p-0.5 ${
                              meal.type === "veg" ? "border-emerald-600" : "border-rose-600"
                            }`}>
                              <div className={`w-1 h-1 rounded-full ${meal.type === "veg" ? "bg-emerald-600" : "bg-rose-600"}`} />
                            </div>
                            <h4 className="text-xs font-black text-slate-800 leading-tight">{meal.title}</h4>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400">{meal.cat}</p>
                          <p className="text-xs font-black text-slate-900">₹{meal.price}</p>
                        </div>

                        <button
                          onClick={() => {
                            if (isSelected) setSelectedMeal(null);
                            else setSelectedMeal({ id: meal.id, title: meal.title, price: meal.price });
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 shadow-xs"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {isSelected ? "ADDED ✓" : "ADD"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setShowRazorpay(true)}
                    className="btn-gold px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all"
                  >
                    CONTINUE TO PAYMENT
                  </button>

                  <button
                    onClick={() => setShowRazorpay(true)}
                    className="text-xs font-extrabold text-slate-500 hover:text-blue-600 hover:underline"
                  >
                    Skip meals →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Sticky Fare Summary & Promo Codes with Independent Scrollbar */}
        <div className="lg:col-span-1 sticky top-28 max-h-[calc(100vh-130px)] overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          
          {/* Fare Summary Card */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs">
            <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider mb-5 border-b border-slate-100 pb-3">
              Fare Summary
            </h3>
            
            <div className="space-y-3.5 mb-6 text-sm font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Base Fare (1 Adult)</span>
                <span>₹{(Math.round(initialAmount * 0.85)).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Taxes & Airline Fees</span>
                <span>₹{(Math.round(initialAmount * 0.15)).toLocaleString("en-IN")}</span>
              </div>

              {tripProtection && (
                <div className="flex justify-between text-emerald-700 font-bold text-xs">
                  <span>Trip Insurance</span>
                  <span>+ ₹199</span>
                </div>
              )}

              {mttplAssured && (
                <div className="flex justify-between text-amber-700 font-bold text-xs">
                  <span>MTTPL Assured Refund</span>
                  <span>+ ₹399</span>
                </div>
              )}

              {selectedSeat && (
                <div className="flex justify-between text-blue-600 font-bold text-xs">
                  <span>Selected Seat ({selectedSeat.number})</span>
                  <span>+ ₹{selectedSeat.price}</span>
                </div>
              )}

              {selectedMeal && (
                <div className="flex justify-between text-amber-600 font-bold text-xs">
                  <span>Selected Meal ({selectedMeal.title})</span>
                  <span>+ ₹{selectedMeal.price}</span>
                </div>
              )}

              <AnimatePresence>
                {appliedCode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between text-emerald-600 font-bold"
                  >
                    <span className="flex items-center gap-1">Applied: {appliedCode}</span>
                    <span>- ₹{appliedDiscount}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-slate-100 my-2" />
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-800">Total Amount</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-bold text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe and secure payments powered by Razorpay.</span>
            </p>
          </div>

          {/* Promo Codes Card */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <BadgePercent className="w-5 h-5 text-blue-600" />
              <span>Coupons & Offers</span>
            </h3>

            {/* Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER PROMO CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none uppercase placeholder-slate-400 focus:bg-white focus:border-blue-500"
              />
              <button
                onClick={() => handleApplyCoupon(couponCode)}
                disabled={!couponCode.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold rounded-xl transition-all"
              >
                APPLY
              </button>
            </div>

            {couponError && <p className="text-[10px] font-bold text-rose-500">{couponError}</p>}

            {/* Active applied coupon banner */}
            <AnimatePresence>
              {appliedCode && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code Applied: {appliedCode}</span>
                    </p>
                    <p className="text-[10px] font-bold text-emerald-700">₹{appliedDiscount} discount deducted.</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[10px] font-extrabold text-rose-600 hover:underline px-2 py-1"
                  >
                    REMOVE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Presets List */}
            <div className="space-y-3 pt-2">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  onClick={() => handleApplyCoupon(coupon.code)}
                  className={`border rounded-2xl p-3.5 cursor-pointer text-left transition-all duration-200 ${
                    appliedCode === coupon.code
                      ? "bg-blue-50/40 border-blue-300"
                      : "bg-white border-slate-200/70 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg uppercase">
                      {coupon.code}
                    </span>
                    {appliedCode === coupon.code && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                    {coupon.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Modal wrapper */}
      <RazorpayModal 
        isOpen={showRazorpay}
        amount={finalAmount}
        email={formData.email}
        phone={formData.phone_number}
        onClose={() => setShowRazorpay(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
