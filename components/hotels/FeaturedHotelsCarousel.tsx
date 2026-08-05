"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";

interface HotelCardItem {
  id: string;
  name: string;
  location: string;
  stars: number;
  rating: number;
  price: number;
  image: string;
}

const FEATURED_HOTELS: HotelCardItem[] = [
  {
    id: "h1",
    name: "Trident Nariman Point",
    location: "Marine Drive",
    stars: 5,
    rating: 4.7,
    price: 24750,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "h2",
    name: "Lemon Tree Premier, Mumbai International Airport",
    location: "Marol",
    stars: 5,
    rating: 4.4,
    price: 15850,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "h3",
    name: "Grand Hyatt Mumbai",
    location: "Siddharrth Nagar",
    stars: 5,
    rating: 4.3,
    price: 28386,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "h4",
    name: "Urban Stays Backpackers Hostel",
    location: "Masjid Bandar",
    stars: 3,
    rating: 3.6,
    price: 350,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "h5",
    name: "The Orchid Hotel Mumbai Vile Parle",
    location: "International Airport",
    stars: 5,
    rating: 4.5,
    price: 9800,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop",
  },
];

export default function FeaturedHotelsCarousel({ city = "Mumbai" }: { city?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const distance = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            For your stay in <span className="capitalize">{city}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Thu, 06 Aug 26 - Sun, 09 Aug 26
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/hotels?destination=${encodeURIComponent(city)}`}
            className="text-blue-600 hover:text-blue-700 font-extrabold text-xs tracking-wider flex items-center gap-1 uppercase"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {FEATURED_HOTELS.map((hotel) => (
          <Link
            key={hotel.id}
            href={`/hotels?destination=${encodeURIComponent(city)}`}
            className="shrink-0 w-64 md:w-72 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-[360px]"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 right-2 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                {hotel.rating}/5
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
                  <span>{hotel.location}</span>
                  <div className="flex items-center text-amber-500 ml-1">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">per night</div>
                  <div className="text-lg font-black text-slate-900">
                    ₹{hotel.price.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Book →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
