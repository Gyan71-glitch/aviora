"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { mockDestinations } from "@/lib/mock-data/destinations";
import { ArrowRight } from "lucide-react";

export default function DestinationGrid() {
  return (
    <section className="section-padding relative bg-white">
      <div className="container-aviora">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="section-label mb-4 block">Trending Now</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight text-midnight-navy">
              Curated Destinations for the Modern Explorer
            </h2>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors group pb-2"
          >
            <span className="text-sm font-semibold tracking-wide uppercase">View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockDestinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer h-[400px] ${
                dest.spanLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1"
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.city}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 overlay-bottom transition-opacity duration-300" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {dest.trending && (
                      <span className="bg-gold/90 text-midnight-navy text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Trending
                      </span>
                    )}
                    <span className="text-white/80 text-sm font-medium">{dest.country}</span>
                  </div>
                  <h3 className="font-display text-3xl font-medium text-white mb-2">{dest.city}</h3>
                  <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <p className="text-sm text-white/70 max-w-[200px]">{dest.description}</p>
                    <div className="text-right">
                      <span className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">From</span>
                      <span className="text-gold font-semibold text-lg">₹{dest.startingPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
