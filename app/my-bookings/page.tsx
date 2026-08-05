"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ticket, Heart, Sparkles, User, Calendar, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import BookingCard from "@/components/bookings/BookingCard";
import { UserBookingItem } from "@/lib/mock-data/user-bookings";

export default function MyBookingsPage() {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "saved">("active");
  const [activeBookings, setActiveBookings] = useState<UserBookingItem[]>([]);
  const [completedBookings, setCompletedBookings] = useState<UserBookingItem[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(284500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserBookings() {
      setLoading(true);
      try {
        const res = await fetch("/api/user/bookings");
        const data = await res.json();
        if (data.success) {
          setActiveBookings(data.activeBookings);
          setCompletedBookings(data.completedBookings);
          setTotalSpent(data.totalSpent);
        }
      } catch (err) {
        console.error("Failed to fetch user bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserBookings();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container-aviora">
        {/* User Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold shadow-md shrink-0">
                <Image
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                  alt={user?.name || "Member"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  {user?.membershipTier || "Platinum Member"}
                </div>
                <h1 className="font-display text-3xl font-bold text-midnight-navy">
                  {user?.name || "Gyan Vaibhav"}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{user?.email || "gyan@sourcemytrip.com"}</p>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="px-4 text-center border-r border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Active Trips</span>
                <span className="text-xl font-bold font-mono text-midnight-navy">{activeBookings.length}</span>
              </div>
              <div className="px-4 text-center border-r border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Total Value</span>
                <span className="text-xl font-bold font-mono text-gold-dark">₹{totalSpent.toLocaleString()}</span>
              </div>
              <div className="px-4 text-center">
                <span className="text-xs text-slate-500 font-medium block">Saved Trips</span>
                <span className="text-xl font-bold font-mono text-slate-700">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 space-x-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "active"
                ? "text-midnight-navy border-b-2 border-gold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Ticket className="w-4 h-4 text-gold-dark" />
            <span>Active Bookings ({activeBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "completed"
                ? "text-midnight-navy border-b-2 border-gold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Completed Trips ({completedBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "saved"
                ? "text-midnight-navy border-b-2 border-gold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Packages & Hotels (4)</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 rounded-3xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {activeTab === "active" && (
              <div>
                {activeBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}

            {activeTab === "completed" && (
              <div>
                {completedBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="glass-dark p-12 text-center rounded-3xl border border-slate-200 bg-white">
                <Heart className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                <h3 className="font-display text-2xl text-midnight-navy mb-2">Saved Trips & Wishlist</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  You have saved 4 luxury holiday packages including *Ritz-Carlton Maldives* and *Burj Al Arab Jumeirah*.
                </p>
                <Link href="/holidays" className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
                  Explore More Packages
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
