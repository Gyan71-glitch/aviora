"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

interface ComingSoonProps {
  serviceName: string;
  serviceIcon: string;
  description: string;
  heroBg: string;
  accentColor?: string; // tailwind class like "from-amber-500"
}

/* ─── floating particle component ─── */
function Particle({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-amber-400/60"
      initial={{ opacity: 0, scale: 0, x, y }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
        y: [y, y - 120, y - 240],
        x: [x, x + Math.sin(delay * 5) * 40, x + Math.sin(delay * 5) * 80],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── animated ring ─── */
function PulseRing({ delay, scale }: { delay: number; scale: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border border-amber-400/30"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [scale, scale + 0.3, scale + 0.6], opacity: [0.6, 0.3, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.35,
  duration: 4 + (i % 3),
  x: Math.random() * 700 - 350,
  y: Math.random() * 400 - 200,
}));

export default function ComingSoon({ serviceName, serviceIcon, description, heroBg }: ComingSoonProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight-navy">
      {/* ─── Background Hero Image with parallax ─── */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <Image
          src={heroBg}
          alt={serviceName}
          fill
          priority
          unoptimized
          className="object-cover scale-110"
        />
      </motion.div>

      {/* ─── Glamour gradient overlay ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-navy/70 via-midnight-navy/50 to-midnight-navy/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-navy/40 via-transparent to-midnight-navy/40" />

      {/* ─── Subtle vignette radial ─── */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(8,11,26,0.6) 100%)" }} />

      {/* ─── Floating particles ─── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {PARTICLES.map((p) => (
          <Particle key={p.id} delay={p.delay} duration={p.duration} x={p.x} y={p.y} />
        ))}
      </div>

      {/* ─── Horizontal shimmer line ─── */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        style={{ top: "50%" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ─── Main Content Card ─── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-amber-400 text-xs font-bold uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Pulsing icon ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center w-32 h-32 mb-10"
        >
          {/* Pulse rings */}
          <PulseRing delay={0} scale={1} />
          <PulseRing delay={1} scale={1} />
          <PulseRing delay={2} scale={1} />

          {/* Icon backdrop */}
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center"
          >
            <span className="text-5xl">{serviceIcon}</span>
            {/* Gold shimmer corner */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* COMING SOON label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-2 mb-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </motion.div>
          <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.4em]">Coming Soon</span>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </motion.div>
        </motion.div>

        {/* Service title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl md:text-6xl font-medium text-white leading-tight mb-5 drop-shadow-2xl"
        >
          {serviceName}
          <br />
          <motion.span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f97316 100%)" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            is Almost Here
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-white/75 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto mb-10"
        >
          {description}
        </motion.p>

        {/* Progress bar animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="w-64 mb-10"
        >
          <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
            <span>Development Progress</span>
            <span>87%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f97316)" }}
              initial={{ width: "0%" }}
              animate={{ width: "87%" }}
              transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>

        {/* Notify badge + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 transition-all hover:shadow-amber-500/50 hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Back to MTTPL</span>
          </Link>

          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 20px rgba(251,191,36,0.4)", "0 0 0px rgba(251,191,36,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="px-7 py-3.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-semibold cursor-default"
          >
            ✨ Notify Me When Live
          </motion.div>
        </motion.div>

        {/* Bottom floating chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-12"
        >
          {["🔒 100% Secure", "⚡ Lightning Fast", "🏆 Premium Experience", "🌍 Worldwide Access"].map((chip, i) => (
            <motion.span
              key={chip}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/50 text-[11px] font-bold tracking-wide backdrop-blur-sm"
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
