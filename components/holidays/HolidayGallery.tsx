"use client";

import Image from "next/image";
import { Sparkles, Camera } from "lucide-react";

interface HolidayGalleryProps {
  title: string;
  image: string;
  gallery?: string[];
  featured?: boolean;
}

export default function HolidayGallery({
  title,
  image,
  gallery = [],
  featured = false,
}: HolidayGalleryProps) {
  const images = gallery.length > 0 ? gallery : [image];

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 border border-slate-200 bg-slate-900 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 h-[380px] md:h-[480px]">
        {/* Main Featured Photo */}
        <div className="relative md:col-span-2 h-full rounded-2xl overflow-hidden group">
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-dark text-midnight-navy font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 z-10">
              <Sparkles className="w-3.5 h-3.5" />
              MTTPL Bestseller
            </div>
          )}
        </div>

        {/* Side Stacked Photos */}
        <div className="hidden md:flex flex-col gap-2 h-full">
          {images.slice(1, 3).map((imgUrl, idx) => (
            <div key={idx} className="relative flex-1 rounded-2xl overflow-hidden group">
              <Image
                src={imgUrl}
                alt={`${title} photo ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
          {images.length <= 1 && (
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
              <Camera className="w-6 h-6 opacity-40 mb-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
