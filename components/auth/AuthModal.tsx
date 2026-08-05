"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(authMode || "signin");
  const [email, setEmail] = useState("gyan@sourcemytrip.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Gyan Vaibhav");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "signin") {
      login(email, name);
    } else {
      register(name, email);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 p-8"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              MTTPL Member Club
            </div>
            <h3 className="font-display text-3xl font-semibold text-midnight-navy">
              {activeTab === "signin" ? "Welcome Back" : "Join MTTPL"}
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              {activeTab === "signin"
                ? "Sign in to access your Platinum perks, bookings & saved trips"
                : "Create an account for instant member discounts & luxury perks"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "signin"
                  ? "bg-white text-midnight-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "signup"
                  ? "bg-white text-midnight-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Gyan Vaibhav"
                    className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-gold focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                {activeTab === "signin" && (
                  <a href="#" className="text-[11px] text-gold-dark hover:underline font-semibold">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-gold/20 mt-6"
            >
              <span>{activeTab === "signin" ? "Sign In to Account" : "Create Platinum Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guarantee Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank-Grade 256-Bit SSL Encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
