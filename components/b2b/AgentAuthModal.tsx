"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, ShieldCheck, CreditCard, ArrowRight, UserCheck } from "lucide-react";

interface AgentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AgentAuthModal({ isOpen, onClose, onSuccess }: AgentAuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
                MTTPL B2B Agent Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {tab === "login" ? "Travel Agent Partner Login" : "Register as Agency Partner"}
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Access B2B Net Fares, Instant Wallet Credit & Custom Agent Markups
            </p>

            {/* Toggle Tabs */}
            <div className="flex bg-white/10 p-1 rounded-xl mt-4 border border-white/10">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  tab === "login" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                Agent Sign-In
              </button>
              <button
                onClick={() => setTab("register")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  tab === "register" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                Register New Agency
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {tab === "login" ? "Welcome back, Travel Partner!" : "Registration Request Received!"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {tab === "login"
                    ? "Redirecting you to your B2B Agent Dashboard..."
                    : "Your B2B Agent Account has been provisioned with ₹5,00,000 credit limit."}
                </p>
              </div>
            ) : (
              <>
                {tab === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agency / Corporate Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skyline Travels Pvt Ltd"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agent Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="agent@agency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {tab === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GSTIN Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="07AAAAA0000A1Z5"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-[11px] text-amber-900">
                    B2B agents get up to <strong className="font-semibold">8.5% Net Commission</strong> and instant GST Input Credit vouchers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {tab === "login" ? "Access Agent Dashboard" : "Create Agent Partner Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
