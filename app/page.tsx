"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SearchWidget from "@/components/ui/SearchWidget";
import DestinationGrid from "@/components/home/DestinationGrid";
import DealsSection from "@/components/home/DealsSection";
import AIAssistant from "@/components/ui/AIAssistant";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2500&auto=format&fit=crop"
            alt="Aircraft flying above clouds"
            fill
            priority
            className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite]"
          />
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-navy/40 via-transparent to-midnight-navy/90" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container-aviora relative z-10 w-full flex flex-col items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="section-label mb-6 tracking-[0.4em]"
            >
              Experience the Extraordinary
            </motion.p>
            <h1 className="font-display text-6xl md:text-8xl font-medium leading-[1.1] mb-6 drop-shadow-2xl">
              The Journey Is <br className="hidden md:block" />
              <span className="text-gold-gradient">The Destination</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light drop-shadow-md">
              Book world-class flights, luxury hotels, and premium experiences seamlessly. 
              Elevate your travel standard.
            </p>
          </motion.div>

          <SearchWidget />
        </div>
      </section>

      {/* Main Content Areas */}
      <DestinationGrid />
      <DealsSection />
      
      {/* Footer minimal for now */}
      <footer className="py-24 md:py-32 border-t border-gray-200 text-center bg-white">
        <div className="container-aviora">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AVIORA. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </main>
  );
}
