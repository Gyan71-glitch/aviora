"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { mockDeals } from "@/lib/mock-data/destinations";
import { Plane, Building } from "lucide-react";

export default function DealsSection() {
  // Take first 4 deals for the homepage
  const featuredDeals = mockDeals.slice(0, 4);

  return (
    <section className="section-padding bg-[#F5F7FA] border-t border-gray-200">
      <div className="container-aviora">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="section-label">Exclusive Offers</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-medium leading-tight text-midnight-navy"
          >
            Uncompromising Luxury, <br/>
            <span className="text-gold-gradient">Exceptional Value</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                  {deal.type === 'flight' ? <Plane className="w-3 h-3 text-gold" /> : <Building className="w-3 h-3 text-gold" />}
                  <span className="text-[10px] font-bold tracking-wider uppercase text-white">
                    {deal.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-1 text-midnight-navy">{deal.title}</h3>
                {deal.airline && <p className="text-sm text-gray-500 mb-4">{deal.airline}</p>}
                
                <div className="flex items-end justify-between mt-6">
                  <div>
                    <span className="text-sm text-gray-400 line-through block mb-1">
                      ₹{deal.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl font-bold text-gold-dark">
                      ₹{deal.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-200 text-midnight-navy text-xs font-semibold px-2 py-1 rounded">
                    -{deal.discount}%
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
