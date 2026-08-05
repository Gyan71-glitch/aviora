"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  User as UserIcon,
  Plane,
  Ticket,
  Heart,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navLinks = [
  { label: "Flights", href: "/?tab=flights#search-widget", tabId: "flights" },
  { label: "Hotels", href: "/?tab=hotels#search-widget", tabId: "hotels" },
  { label: "Forex", href: "https://forexxmate.netlify.app/", external: true, tabId: "forex" },
  { label: "Holidays", href: "/?tab=holidays#search-widget", tabId: "holidays" },
  { label: "Trains", href: "/?tab=trains#search-widget", tabId: "trains" },
  { label: "Buses", href: "/?tab=buses#search-widget", tabId: "buses" },
  { label: "Cabs", href: "/?tab=transfers#search-widget", tabId: "transfers" },
  { label: "Tours", href: "/?tab=sightseeing#search-widget", tabId: "sightseeing" },
  { label: "Visa", href: "/?tab=visa#search-widget", tabId: "visa" },
  { label: "Cruises", href: "/?tab=cruise#search-widget", tabId: "cruise" },
  { label: "Insurance", href: "/?tab=insurance#search-widget", tabId: "insurance" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();

  const handleNavClick = (e: React.MouseEvent, link: (typeof navLinks)[0]) => {
    if (link.external) return;
    if (pathname === "/" && link.tabId) {
      e.preventDefault();
      router.push(`/?tab=${link.tabId}#search-widget`);
      const el = document.getElementById("search-widget");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isB2B = pathname.startsWith("/b2b");
  if (isB2B) return null;

  const isHome = pathname === "/";
  const isSolid = scrolled || !isHome;
  const textColor = isSolid ? "#071426" : "white";
  const textMuted = isSolid ? "rgba(7,20,38,0.7)" : "rgba(255,255,255,0.85)";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: isHome ? "fixed" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.4s ease",
          background: isSolid ? "rgba(255, 255, 255, 0.98)" : "transparent",
          backdropFilter: isSolid ? "blur(20px)" : "none",
          borderBottom: isSolid ? "1px solid rgba(0,0,0,0.08)" : "none",
          padding: scrolled ? "12px 0" : "20px 0",
          boxShadow: isSolid ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
        }}
      >
        <div
          className="container-aviora"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plane
                size={18}
                color="#071426"
                strokeWidth={2.5}
                style={{ transform: "rotate(-45deg)" }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: textColor,
              }}
            >
              MTTPL
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "18px" }}
            className="hidden-mobile overflow-x-auto no-scrollbar max-w-[68vw]"
          >
            {navLinks.map((link) => {
              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textMuted,
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      transition: "color 0.2s",
                      whiteSpace: "nowrap",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                  >
                    {link.label}
                  </a>
                );
              }
              if ((link as any).highlight) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 border border-amber-400/40 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    color: textMuted,
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
            className="hidden-mobile"
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                color: textMuted,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              <Globe size={15} />
              <span>EN</span>
              <ChevronDown size={12} />
            </button>

            {isLoggedIn && user ? (
              /* User Profile Dropdown Menu */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full border border-slate-200 hover:border-gold bg-white transition-all shadow-sm"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold">
                    <Image
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
                      }
                      alt={user.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 pr-1">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-3"
                    >
                      {/* User Header in Dropdown */}
                      <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                        <div className="text-xs font-bold text-midnight-navy">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {user.email}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-gold-dark" />
                          {user.membershipTier}
                        </div>
                      </div>

                      {/* Dropdown Links */}
                      <div className="space-y-1 text-xs font-medium">
                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-midnight-navy transition-colors"
                        >
                          <Ticket className="w-4 h-4 text-gold-dark" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          href="/holidays"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-midnight-navy transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Saved Trips & Hotels</span>
                        </Link>
                        <Link
                          href="#"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-midnight-navy transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Logged Out Buttons */
              <>
                <button
                  onClick={() => openAuthModal("signin")}
                  style={{
                    color: textMuted,
                    background: "transparent",
                    border: "none",
                    fontSize: "13px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <UserIcon size={15} />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="btn-gold"
                  style={{
                    padding: "9px 22px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Sign Up Free
                </button>
              </>
            )}
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
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
                top: 24,
                right: 24,
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
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(e, link);
                  }}
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
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("signin");
                }}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  background: "transparent",
                  border: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("signup");
                }}
                className="btn-gold"
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
