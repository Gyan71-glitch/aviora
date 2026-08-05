"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Check,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Heart,
  Building,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Luggage,
  Users,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  X,
  CreditCard
} from "lucide-react";
import { Hotel } from "@/lib/types";
import RazorpayModal from "@/components/checkout/RazorpayModal";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  // Tabs for Page Navigation
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "facilities" | "policies" | "reviews">("overview");

  // Booking Flow States
  const [selectedRoomOption, setSelectedRoomOption] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Booking details form state
  const [guestTitle, setGuestTitle] = useState("mr");
  const [guestFirstName, setGuestFirstName] = useState("John");
  const [guestLastName, setGuestLastName] = useState("Doe");
  const [guestEmail, setGuestEmail] = useState("john.doe@example.com");
  const [guestPhone, setGuestPhone] = useState("+919876543210");
  
  // Checkout options
  const [addSpaPackage, setAddSpaPackage] = useState(false);
  const [addAirportPickup, setAddAirportPickup] = useState(false);
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    async function fetchHotelDetail() {
      try {
        const res = await fetch(`/api/hotels/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
        }
      } catch (err) {
        console.error("Failed to fetch hotel details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotelDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 pb-20 flex justify-center items-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 font-display text-lg">Retrieving luxury property details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 pb-20 flex justify-center items-center font-sans">
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 max-w-md shadow-2xl">
          <h2 className="font-display text-2xl text-slate-900 mb-4 font-black">Property Not Found</h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">
            The requested luxury property could not be located or is no longer available.
          </p>
          <Link href="/hotels" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold shadow-md inline-block">
            Back to Hotels Search
          </Link>
        </div>
      </div>
    );
  }

  // Base Prices and Options calculation
  const room = hotel.rooms?.[0] || {
    roomId: "default-room",
    roomType: "Luxury Suite",
    boardBasis: "Breakfast Included",
    pricePerNight: hotel.pricePerNight,
    maxOccupancy: 2,
    cancellationPolicy: "Free cancellation until 24 hours before check-in"
  };

  // Generate MMT Inclusions
  const roomInclusionOptions = [
    {
      id: `${room.roomId}-opt-1`,
      name: "Room Only",
      cancellation: "Non-Refundable",
      priceDiff: -1500,
      inclusions: ["Free WiFi", "Access to Fitness Center", "Air Conditioning"],
    },
    {
      id: `${room.roomId}-opt-2`,
      name: "Room with Breakfast (Recommended)",
      cancellation: room.cancellationPolicy,
      priceDiff: 0,
      inclusions: ["Free WiFi", "Free Premium Breakfast Buffet", "Access to Swimming Pool", "Air Conditioning"],
    },
    {
      id: `${room.roomId}-opt-3`,
      name: "Half Board (Breakfast + Lunch or Dinner)",
      cancellation: room.cancellationPolicy,
      priceDiff: 3500,
      inclusions: ["Free WiFi", "Free Buffet Breakfast", "Free Gourmet Dinner at Signature Restaurant", "Swimming Pool & Spa Access"],
    }
  ];

  // Dynamic price calculation inside checkout
  const selectedOptionRate = selectedRoomOption 
    ? (room.pricePerNight + selectedRoomOption.priceDiff) 
    : room.pricePerNight;
  const nightsCount = 1; // Default to 1 night stay
  const baseTotal = selectedOptionRate * nightsCount;
  const taxesFee = Math.round(baseTotal * 0.18); // 18% luxury resort GST
  
  const spaCost = addSpaPackage ? 2500 : 0;
  const cabCost = addAirportPickup ? 1800 : 0;

  const finalCheckoutAmount = baseTotal + taxesFee + spaCost + cabCost;

  // Handle Reservation Confirmation
  const handlePaymentSuccess = async (paymentId: string) => {
    setShowRazorpay(false);
    setIsBooking(true);

    // Simulate database booking entry
    setTimeout(() => {
      const generatedOrderId = `ord_hotel_${hotel.id}-${room.roomId}-${Math.floor(1000 + Math.random() * 9000)}`;
      router.push(`/ticket/${generatedOrderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] pb-20 font-sans text-slate-800">
      <Navbar />
      
      {/* Hotel Breadcrumbs & Top Section */}
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/hotels"
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 hover:text-amber-600 transition-colors font-extrabold"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Back to Hotels Search</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 transition-all shadow-xs cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-400 transition-all shadow-xs cursor-pointer">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hotel Details Main Header */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-2">
                  {hotel.stars} Star Luxury Property
                </span>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Loved by Couples
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {hotel.name}
              </h1>

              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{hotel.address || `${hotel.location}, ${hotel.city}, ${hotel.country}`}</span>
                <span className="text-slate-300">|</span>
                <span className="text-blue-600 hover:underline cursor-pointer">View on Map</span>
              </p>
            </div>

            {/* MMT Review & Score Badge */}
            <div className="flex items-center gap-4 shrink-0 bg-slate-50 border border-slate-200/70 p-4 rounded-2xl">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[11px] font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">EXCELLENT</span>
                  <span className="text-base font-black text-slate-900">{hotel.rating.toFixed(1)} / 5</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">{hotel.reviewCount} verified guest reviews</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
                {hotel.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Quick Info bar */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Check-in: <strong className="text-slate-900">{hotel.checkInTime || "14:00"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Check-out: <strong className="text-slate-900">{hotel.checkOutTime || "12:00"}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-slate-400">
              <span>🎟️ FREE CANCELLATION</span>
              <span>•</span>
              <span>🍽️ FINE DINING</span>
              <span>•</span>
              <span>🏊‍♂️ INFINITY POOL</span>
            </div>
          </div>
        </div>


        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 rounded-[32px] overflow-hidden border border-slate-200/80 shadow-xs bg-white p-2">
          <div className="md:col-span-2 relative h-80 md:h-[460px] rounded-2xl overflow-hidden">
            <Image
              src={hotel.image}
              alt={hotel.name}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-102"
              unoptimized
            />
          </div>
          <div className="grid grid-rows-2 gap-4 h-80 md:h-[460px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={hotel.galleryImages?.[1] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
                alt="Amenity image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={hotel.galleryImages?.[0] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"}
                alt="Room detail"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-black text-sm uppercase tracking-wider cursor-pointer hover:bg-slate-900/70 transition-all">
                <span>View All 18 Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Anchor Navigation Bar */}
        <div className="sticky top-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm p-2 mb-6 flex gap-2">
          {["overview", "rooms", "facilities", "policies", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                document.getElementById(tab)?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab Content */}
        <div id="overview" className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs mb-8">
          <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-wider mb-4">Property Overview</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-5xl">
            {hotel.description || "Indulge in pure comfort at our 5-star premier resort. Nestled amidst prime locations with spectacular views, the property offers guest accommodations designed to the highest standards, butler services, premium indoor and outdoor swimming, and Michelin star level dining options."}
          </p>
        </div>

        {/* Rooms & Options Grid (MakeMyTrip Style) */}
        <div id="rooms" className="space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-wider">Select Room & Package Inclusions</h3>
            <span className="text-xs font-bold text-slate-500">Prices are based on 1 Night, 2 Adults</span>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-wider">{room.roomType}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">Air Conditioned • High-Speed WiFi • Private Marble Bathroom</p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/35">
                Premium Inclusions Available
              </span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {roomInclusionOptions.map((opt) => (
                <div key={opt.id} className="py-6 first:pt-0 last:pb-0 flex flex-col lg:flex-row justify-between gap-6 items-start">
                  
                  {/* Option Inclusions details */}
                  <div className="flex-1 space-y-3">
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide">{opt.name}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {opt.inclusions.map((inc, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Option cancellation & details */}
                  <div className="w-full lg:w-48 text-left lg:text-center space-y-1.5 border-t lg:border-t-0 lg:border-x border-slate-100 pt-4 lg:pt-0 lg:px-4">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">CANCELLATION POLICY</span>
                    <span className={`text-xs font-black inline-block px-2.5 py-0.5 rounded-full ${
                      opt.cancellation.includes("Free") ? "text-emerald-800 bg-emerald-50 border border-emerald-200" : "text-rose-800 bg-rose-50 border border-rose-200"
                    }`}>
                      {opt.cancellation}
                    </span>
                  </div>

                  {/* Option Pricing & Book Button */}
                  <div className="w-full lg:w-56 text-left lg:text-right flex flex-col justify-between items-start lg:items-end gap-3 min-w-[200px]">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider mb-1">RATE PER NIGHT</span>
                      <div className="flex items-baseline gap-1.5 justify-start lg:justify-end">
                        <span className="text-slate-400 line-through text-sm">₹{Math.round((room.pricePerNight + opt.priceDiff) * 1.25).toLocaleString()}</span>
                        <span className="text-2xl font-black text-slate-900">₹{Math.round(room.pricePerNight + opt.priceDiff).toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">+ ₹{Math.round((room.pricePerNight + opt.priceDiff) * 0.18).toLocaleString()} taxes & fees</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoomOption(opt);
                        setIsCheckoutOpen(true);
                      }}
                      className="btn-gold w-full lg:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities Tab Content */}
        <div id="facilities" className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs mb-8 space-y-4">
          <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-wider">Property Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl text-xs font-bold text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  {amenity.toLowerCase().includes("wifi") && <Wifi className="w-4 h-4" />}
                  {amenity.toLowerCase().includes("breakfast") && <Coffee className="w-4 h-4" />}
                  {amenity.toLowerCase().includes("dining") && <Coffee className="w-4 h-4" />}
                  {!amenity.toLowerCase().includes("wifi") && !amenity.toLowerCase().includes("breakfast") && !amenity.toLowerCase().includes("dining") && <Check className="w-4 h-4" />}
                </div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policies Tab Content */}
        <div id="policies" className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs mb-8 space-y-6">
          <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-wider">Hotel Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-600">
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-slate-900 uppercase">Check-in / Check-out Guidelines</h4>
              <ul className="space-y-1.5 list-disc list-inside pl-1 text-slate-500 font-medium">
                <li>Government photo ID is mandatory at the time of check-in.</li>
                <li>Check-in begins at {hotel.checkInTime || "14:00"}. Early check-in is subject to availability.</li>
                <li>Check-out must be completed by {hotel.checkOutTime || "12:00"}.</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-slate-900 uppercase">Child & Extra Bed Policies</h4>
              <ul className="space-y-1.5 list-disc list-inside pl-1 text-slate-500 font-medium">
                <li>Children under 6 stay free when utilizing existing bedding.</li>
                <li>Extra rollaway bed can be requested at concierge desk for additional charge.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Tab Content */}
        <div id="reviews" className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-wider">Guest Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                author: "Vikram K.",
                rating: 4.8,
                comment: "Spectacular property with world-class hospitality! The rooms are duplex design and butler service was outstanding.",
                date: "July 2026"
              },
              {
                author: "Ananya S.",
                rating: 5.0,
                comment: "Unforgettable stay. Loved the private pool views and outstanding buffet breakfast inclusions. Highly recommended!",
                date: "June 2026"
              }
            ].map((rev, index) => (
              <div key={index} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-none">{rev.author}</h4>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">Stayed in {rev.date}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded">
                    ★ {rev.rating}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-In Checkout Drawer Panel */}
      <AnimatePresence>
        {isCheckoutOpen && selectedRoomOption && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Drawer Panel */}
            <div className="absolute inset-y-0 right-0 max-w-lg w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className="w-full bg-[#f4f4f5] shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto"
              >
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
                  <div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">MTTPL SECURE CHECKOUT</span>
                    <h3 className="text-base font-black uppercase tracking-wide">Complete Your Reservation</h3>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Content scrollable area */}
                <div className="p-5 flex-1 space-y-6">
                  
                  {/* Selected Inclusions Details */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">{hotel.name}</h4>
                        <p className="text-[11px] font-bold text-slate-500 mt-0.5">{room.roomType}</p>
                        <p className="text-[11px] font-bold text-emerald-700 mt-1">{selectedRoomOption.name}</p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Rate per night</span>
                      <span>₹{selectedOptionRate.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Guest details form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-left">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Guest Details</h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                        <select
                          value={guestTitle}
                          onChange={(e) => setGuestTitle(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                        >
                          <option value="mr">Mr</option>
                          <option value="ms">Ms</option>
                          <option value="mrs">Mrs</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">First Name</label>
                        <input
                          type="text"
                          value={guestFirstName}
                          onChange={(e) => setGuestFirstName(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                          placeholder="As per Passport/ID"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={guestLastName}
                        onChange={(e) => setGuestLastName(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                        placeholder="As per Passport/ID"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Premium Add-on services */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-left">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Enhance Your Stay</h4>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={addSpaPackage}
                        onChange={(e) => setAddSpaPackage(e.target.checked)}
                        className="mt-1 text-amber-600 focus:ring-amber-500 rounded border-slate-300"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">Add Premium Spa Massage (+ ₹2,500)</p>
                        <p className="text-[10px] font-bold text-slate-400">Includes 60-min Ayurvedic therapy & steam access.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={addAirportPickup}
                        onChange={(e) => setAddAirportPickup(e.target.checked)}
                        className="mt-1 text-amber-600 focus:ring-amber-500 rounded border-slate-300"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">Request Airport Sedan Pickup (+ ₹1,800)</p>
                        <p className="text-[10px] font-bold text-slate-400">One-way private airport transfer with professional chauffeur.</p>
                      </div>
                    </label>
                  </div>

                  {/* GST (Optional) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-left">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasGST}
                        onChange={(e) => setHasGST(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                      />
                      <span className="text-xs font-black text-slate-800">I have a GST registration number</span>
                    </label>

                    {hasGST && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-2">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">GST Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 22AAAAA0000A1Z5"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company Name</label>
                          <input
                            type="text"
                            placeholder="Registered Enterprise Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Footer Payment Section */}
                <div className="p-5 bg-white border-t border-slate-200 space-y-4">
                  <div className="space-y-2 text-xs font-bold text-slate-500">
                    <div className="flex justify-between">
                      <span>Room Rent ({nightsCount} Night)</span>
                      <span>₹{baseTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resort Luxury GST (18%)</span>
                      <span>₹{taxesFee.toLocaleString()}</span>
                    </div>
                    {(addSpaPackage || addAirportPickup) && (
                      <div className="flex justify-between text-amber-600">
                        <span>Selected Add-ons</span>
                        <span>+ ₹{(spaCost + cabCost).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-100 my-1" />
                    <div className="flex justify-between items-baseline text-slate-900">
                      <span className="text-sm font-black uppercase">Grand Total</span>
                      <span className="text-xl font-black">₹{finalCheckoutAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!guestFirstName.trim() || !guestLastName.trim()) {
                        alert("Please fill in the guest First Name and Last Name.");
                        return;
                      }
                      setShowRazorpay(true);
                    }}
                    className="w-full btn-gold py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    <span>CONTINUE TO PAYMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking loader state overlay */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="text-white text-2xl font-black tracking-tight">Securing Your Resort Stay...</h3>
            <p className="text-slate-400 mt-2 font-medium">Please wait while we establish instant confirmation with the resort network.</p>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Gateway Modal wrapper */}
      <RazorpayModal
        isOpen={showRazorpay}
        amount={finalCheckoutAmount}
        email={guestEmail}
        phone={guestPhone}
        onClose={() => setShowRazorpay(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
