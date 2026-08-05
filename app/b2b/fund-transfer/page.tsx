"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowLeft,
  CreditCard,
  Building2,
  QrCode,
} from "lucide-react";
import B2BHeader from "@/components/b2b/B2BHeader";
import { mockAgentProfile } from "@/lib/mock-data/agent";

export default function OnlineFundTransferPage() {
  const [amount, setAmount] = useState(50000);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "NetBanking" | "NEFT">("UPI");
  const [submitted, setSubmitted] = useState(false);

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert(`Payment initiated for ₹${amount.toLocaleString("en-IN")}. Redirecting to Payment Gateway...`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <B2BHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Link
              href="/b2b"
              className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Agent Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Wallet className="w-8 h-8 text-amber-600" /> Online Fund Transfer & Top-Up
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add instant deposit funds to your MTTPL Agency Wallet via Razorpay, UPI, or NetBanking
            </p>
          </div>
        </div>

        {/* Current Balance Display */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Current Deposit Wallet Balance</span>
            <div className="text-3xl font-black text-slate-900">
              ₹{mockAgentProfile.walletBalance.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold">Approved Credit Line</span>
            <div className="text-lg font-bold text-slate-900">
              ₹{mockAgentProfile.creditLimit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Fund Transfer Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Initiate Instant Balance Top-Up</h2>

          <form onSubmit={handleFundSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Enter Amount to Deposit (INR)
              </label>
              <input
                type="number"
                min="1000"
                step="5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Amount Selector */}
            <div className="grid grid-cols-4 gap-3">
              {[25000, 50000, 100000, 250000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    amount === amt
                      ? "bg-slate-900 text-amber-400 border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  +₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode("UPI")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === "UPI"
                      ? "bg-slate-900 border-slate-900 text-amber-400 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1" />
                  <div className="text-xs font-bold">UPI / GPay / PhonePe</div>
                  <div className="text-[10px] opacity-80 font-normal">Instant Credit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("NetBanking")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === "NetBanking"
                      ? "bg-slate-900 border-slate-900 text-amber-400 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <div className="text-xs font-bold">NetBanking / Cards</div>
                  <div className="text-[10px] opacity-80 font-normal">All Major Banks</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("NEFT")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === "NEFT"
                      ? "bg-slate-900 border-slate-900 text-amber-400 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <div className="text-xs font-bold">Bank Transfer (NEFT)</div>
                  <div className="text-[10px] opacity-80 font-normal">Virtual Bank Account</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {submitted ? "Connecting Gateway..." : `Proceed to Add ₹${amount.toLocaleString("en-IN")}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
