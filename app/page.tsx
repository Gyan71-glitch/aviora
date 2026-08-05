"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SearchWidget from "@/components/ui/SearchWidget";
import DestinationGrid from "@/components/home/DestinationGrid";
import DealsSection from "@/components/home/DealsSection";
import FeaturedHotelsCarousel from "@/components/hotels/FeaturedHotelsCarousel";
import AIAssistant from "@/components/ui/AIAssistant";

function HomeContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "flights");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
      const el = document.getElementById("search-widget");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [tabParam]);

  const getHeroBg = (tab: string) => {
    switch (tab) {
      case "hotels":
        return "/hotel-hero.png";
      case "forex":
        return "/forex-hero.png";
      case "holidays":
        return "/holidays-hero.png";
      case "trains":
        return "/trains-hero.png";
      case "buses":
        return "/buses-hero.png";
      case "transfers":
        return "/cabs-hero.png";
      case "sightseeing":
        return "/tours-hero.png";
      case "visa":
        return "/visa-hero.png";
      case "cruise":
        return "/cruise-hero.png";
      case "insurance":
        return "/insurance-hero.png";
      case "flights":
      default:
        return "/flight-hero.png";
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] pt-36 md:pt-44 pb-32 flex items-center justify-center">
        {/* Background Image with Smooth Cross-fade Transition */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={getHeroBg(activeTab)}
                alt={`${activeTab} background`}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradients to ensure text readability while keeping the image bright & shining */}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-navy/30 via-transparent to-midnight-navy/60" />
        </div>

        <div className="container-aviora relative z-20 w-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8 md:mb-10"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="section-label mb-4 tracking-[0.4em]"
            >
              Experience the Extraordinary
            </motion.p>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.15] mb-4 drop-shadow-2xl text-white">
              The Journey Is <br className="hidden md:block" />
              <span className="text-gold-gradient">The Destination</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
              Book world-class flights, luxury hotels, and premium experiences seamlessly. 
              Elevate your travel standard.
            </p>
          </motion.div>

          <SearchWidget initialTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>

      {/* Main Content Areas */}
      <DestinationGrid />
      <div className="container-aviora">
        <FeaturedHotelsCarousel city="Mumbai" />
      </div>
      <DealsSection />
      
      {/* Premium detailed footer (MMT Style) */}
      <footer className="w-full bg-[#f4f4f5] border-t border-slate-200">
        {/* Top Section: Routes, Visas & Hotels */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 text-left border-b border-slate-200/60">
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Popular International Routes</h4>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Delhi to Mumbai Flight, Delhi to Goa Flight, Mumbai to Bangalore Flight, Delhi to Dubai Flight, Delhi to Singapore Flight, Delhi to Bangkok Flight, Delhi to London Flight, Mumbai to Dubai Flight, Delhi to Paris Flight, Mumbai to London Flight, Bangalore to Singapore Flight, Chennai to Colombo Flight.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Book Hotels in India from Top Destinations</h4>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Hotels in Shimla, Hotels in Manali, Hotels in Goa, Hotels in Jaipur, Hotels in Udaipur, Hotels in Mumbai, Hotels in Delhi, Hotels in Bangalore, Hotels in Ooty, Hotels in Srinagar, Hotels in Gulmarg, Hotels in Leh, Hotels in Hyderabad, Hotels in Munnar, Hotels in Rishikesh, Hotels in Lonavala.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Popular International Destinations</h4>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Maldives Visa, Dubai Visa, Singapore Visa, Thailand Visa, Schengen Visa, UK Visa, USA Visa, Vietnam Visa, Bali Visa, Malaysia Visa, Sri Lanka Visa, Indonesia Visa, Japan Visa, Nepal Visa.
            </p>
          </div>
        </div>

        {/* Middle Section: Three Detailed Columns */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-wide">Why MTTPL?</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Established with a vision to redefine travel, Malhotra Tours and Travels Pvt Ltd (MTTPL) is India's premier luxury travel booking platform. We specialize in curating high-end bespoke holiday packages, premium flight bookings, and 5-star luxury hotel stays across the globe. With our state-of-the-art AI Travel Assistant (Aviora) and dedicated concierge, we ensure every journey is an exceptional masterpiece of comfort, safety, and seamless experience.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-wide">Booking Flights with MTTPL</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              At MTTPL, we offer exclusive access to premium corporate flight rates and negotiated airline discounts. Whether you are traveling first class, business, or premium economy, our platform provides lightning-fast comparisons, instant seat confirmation, and seamless booking management. Rest assured with our 24/7 dedicated support and premium flight care programs.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-wide">Domestic & International Journeys</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              As a leading luxury player in the travel space, MTTPL guarantees competitive deals for both domestic and international getaways. From secluded overwater water villas in the Maldives to heritage mountain retreats in Shimla, we partner directly with elite hospitality brands globally. Experience premium, personalized travel design tailored precisely to your family's needs.
            </p>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright (Black Background) */}
        <div className="w-full bg-[#0a0a0a] text-white py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[11px] font-bold text-slate-400 tracking-wide">
              © {new Date().getFullYear()} Malhotra Tours and Travels Pvt Ltd (MTTPL). All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
