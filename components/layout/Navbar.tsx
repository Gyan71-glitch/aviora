"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe, User, Plane } from "lucide-react";

const navLinks = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Trains", href: "#" },
  { label: "Buses", href: "#" },
  { label: "Deals", href: "#deals" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const isSolid = scrolled || !isHome;
  const textColor = isSolid ? "#071426" : "white";
  const textMuted = isSolid ? "rgba(7,20,38,0.6)" : "rgba(255,255,255,0.75)";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.4s ease",
          background: isSolid
            ? "rgba(255, 255, 255, 0.98)"
            : "transparent",
          backdropFilter: isSolid ? "blur(20px)" : "none",
          borderBottom: isSolid ? "1px solid rgba(0,0,0,0.05)" : "none",
          padding: scrolled ? "12px 0" : "20px 0",
          boxShadow: isSolid ? "0 4px 20px rgba(0,0,0,0.03)" : "none"
        }}
      >
        <div className="container-aviora" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #D4AF37, #B8960C)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Plane size={18} color="#071426" strokeWidth={2.5} style={{ transform: "rotate(-45deg)" }} />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: textColor,
            }}>SOURCE MY TRIP</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "36px" }} className="hidden-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: textMuted,
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden-mobile">
            <button style={{
              background: "transparent",
              border: "none",
              color: textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
            }}>
              <Globe size={15} />
              <span>EN</span>
              <ChevronDown size={12} />
            </button>
            <Link
              href="#"
              style={{
                color: textMuted,
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <User size={15} />
              Sign In
            </Link>
            <Link
              href="#"
              className="btn-gold"
              style={{
                padding: "9px 22px",
                borderRadius: "8px",
                fontSize: "13px",
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: textColor,
              cursor: "pointer",
              display: "none",
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(7,20,38,0.98)",
              backdropFilter: "blur(24px)",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                top: 24, right: 24,
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <X size={28} />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "36px",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Sign In</Link>
              <Link href="#" className="btn-gold" style={{ padding: "10px 24px", borderRadius: "8px", fontSize: "14px", textDecoration: "none" }}>Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
