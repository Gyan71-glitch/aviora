"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Wallet,
  CreditCard,
  TrendingUp,
  Percent,
  PlusCircle,
  FileText,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  mockAgentProfile,
  mockAgentBookings,
} from "@/lib/mock-data/agent";
import B2BSearchWidget from "@/components/b2b/B2BSearchWidget";
import AgentAuthModal from "@/components/b2b/AgentAuthModal";
import B2BHeader from "@/components/b2b/B2BHeader";

export default function B2BDashboardPage() {
  const [agent, setAgent] = useState(mockAgentProfile);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(50000);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpSuccess(true);
    setTimeout(() => {
      setAgent((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + topUpAmount,
      }));
      setTopUpSuccess(false);
      setTopUpModalOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <B2BHeader />

      <div className="max-w-7xl mx-auto space-y-8 pt-6 px-4 sm:px-6 lg:px-8">
        {/* Agent Header Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Agency Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {agent.tier}
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  ID: <strong className="text-slate-900">{agent.agencyId}</strong>
                </span>
                {agent.iataCode && (
                  <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    IATA Accredited
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {agent.agencyName}
              </h1>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span>Manager: <strong className="text-slate-900">{agent.contactPerson}</strong></span>
                <span>•</span>
                <span>GSTIN: <strong className="text-slate-900">{agent.gstin}</strong></span>
              </p>
            </div>

            {/* Wallet & Credit Limit Display */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Wallet Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl min-w-[180px]">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <Wallet className="w-3.5 h-3.5 text-amber-600" /> Wallet Balance
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{agent.walletBalance.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Credit Limit Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl min-w-[180px]">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Credit Limit
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{(agent.creditLimit - agent.creditUsed).toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  Limit: ₹{agent.creditLimit.toLocaleString("en-IN")} (Used: ₹{agent.creditUsed.toLocaleString("en-IN")})
                </div>
              </div>

              {/* Top-Up Button */}
              <button
                onClick={() => setTopUpModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-4 rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Top-Up Wallet
              </button>
            </div>
          </div>

          {/* Quick Sub-nav bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/b2b"
                className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                Agent Dashboard
              </Link>
              <Link
                href="/b2b/markups"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-200"
              >
                <Percent className="w-3.5 h-3.5 text-amber-600" /> Custom Markups
              </Link>
              <Link
                href="/b2b/ledger"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Wallet Ledger
              </Link>
            </div>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-amber-600" /> Switch Agent Account
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Monthly Gross Turnover</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">₹18,45,000</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>+18.4% vs last month</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Agent Commission Earned</span>
              <Percent className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">₹1,24,500</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Average Margin: <strong className="text-slate-900">6.75%</strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Active Agent Bookings</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">42 Bookings</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Flights: 28 | Hotels: 10 | Packages: 4
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Commission Payout Tier</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">Platinum Partner</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Next Tier: <strong className="text-slate-900">Diamond (at ₹25L)</strong>
            </div>
          </div>
        </div>

        {/* B2B Agent Search Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-600" /> Agent B2B Net Fare Search
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing Agency Net Rates with Zero Consumer Markup
            </span>
          </div>
          <B2BSearchWidget />
        </div>

        {/* Recent Agent Bookings Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Agent Bookings & Issued Vouchers</h3>
              <p className="text-xs text-slate-500">
                Download client vouchers with custom agency branding & GST input invoices
              </p>
            </div>
            <Link
              href="/b2b/ledger"
              className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-bold"
            >
              View Full Financial Statement <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Booking ID / PNR</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Passenger / Lead</th>
                  <th className="p-3.5">Destination / Sector</th>
                  <th className="p-3.5">Net Fare</th>
                  <th className="p-3.5">Client Gross</th>
                  <th className="p-3.5">Your Earnings</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockAgentBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-amber-700">
                      {b.bookingId}
                      <span className="block text-[10px] text-slate-500 font-mono font-normal">{b.pnr}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg font-bold text-[11px] text-slate-800">
                        {b.serviceType}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{b.passengerName}</td>
                    <td className="p-3.5 text-slate-600">{b.destination}</td>
                    <td className="p-3.5 font-semibold text-slate-600">
                      ₹{b.netFare.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{b.grossFare.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      +₹{b.commissionEarned.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => alert(`Downloading Client Voucher for ${b.pnr}...`)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-lg border border-slate-200 flex items-center gap-1 text-[11px] font-bold transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-600" /> Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent Auth Modal */}
      <AgentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Top-Up Deposit Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold">Top-Up Agent Deposit Wallet</h3>
            <p className="text-xs text-slate-500">
              Instant balance credit via UPI, NetBanking, or Razorpay Payment Gateway.
            </p>

            {topUpSuccess ? (
              <div className="py-6 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                <h4 className="font-bold text-lg text-slate-900">Deposit Successful!</h4>
                <p className="text-xs text-slate-500">₹{topUpAmount.toLocaleString("en-IN")} added to wallet.</p>
              </div>
            ) : (
              <form onSubmit={handleTopUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Enter Amount (INR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 text-xs rounded-xl border transition-all font-semibold ${
                        topUpAmount === amt
                          ? "bg-slate-900 text-amber-400 border-slate-900 font-bold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      +₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
