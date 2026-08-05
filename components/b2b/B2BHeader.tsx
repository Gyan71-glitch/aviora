"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plane,
  Building,
  Compass,
  Car,
  Camera,
  FileText,
  Users,
  Settings,
  UserCheck,
  Wallet,
  CreditCard,
  ChevronDown,
  Sparkles,
  LogOut,
} from "lucide-react";
import { mockAgentProfile } from "@/lib/mock-data/agent";

export default function B2BHeader() {
  const pathname = usePathname();
  const [reportsOpen, setReportsOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-sm">
      {/* Top Agent Balance & Status Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {mockAgentProfile.tier}
            </span>
            <span className="text-slate-300 font-semibold">
              Agency: <strong className="text-white">{mockAgentProfile.agencyName}</strong> (ID: {mockAgentProfile.agencyId})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Wallet:</span>
              <strong className="text-amber-400 font-bold">
                ₹{mockAgentProfile.walletBalance.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Credit Line:</span>
              <strong className="text-white font-bold">
                ₹{(mockAgentProfile.creditLimit - mockAgentProfile.creditUsed).toLocaleString("en-IN")}
              </strong>
            </div>

            <Link
              href="/b2b/fund-transfer"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm"
            >
              + Top-Up Balance
            </Link>

            <Link
              href="/"
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              Exit B2B Portal <LogOut className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/b2b" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-sm">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-slate-900">MTTPL B2B</span>
            <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-widest">
              Travel Agent Portal
            </span>
          </div>
        </Link>

        {/* Menu Links matching SMT B2B Header */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {/* Products */}
          <Link
            href="/b2b"
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              pathname === "/b2b"
                ? "bg-slate-900 text-amber-400 font-bold shadow-sm"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Plane className="w-4 h-4 text-amber-500" /> Flight
          </Link>

          <Link
            href="/hotels"
            className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Building className="w-4 h-4 text-blue-600" /> Hotel
          </Link>

          <Link
            href="/holidays"
            className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-600" /> Holiday
          </Link>

          <Link
            href="/transfers"
            className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Car className="w-4 h-4 text-purple-600" /> Transfer
          </Link>

          <Link
            href="/sightseeing"
            className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Camera className="w-4 h-4 text-rose-600" /> Sightseeing
          </Link>

          {/* Reports Dropdown */}
          <div className="relative" onMouseLeave={() => setReportsOpen(false)}>
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              onMouseEnter={() => setReportsOpen(true)}
              className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-600" /> Reports <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {reportsOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                <Link
                  href="/b2b/ledger"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Partner Ledger & Statements
                </Link>
                <Link
                  href="/b2b"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Sales & Commission Report
                </Link>
              </div>
            )}
          </div>

          {/* Manage Partners Dropdown */}
          <div className="relative" onMouseLeave={() => setPartnersOpen(false)}>
            <button
              onClick={() => setPartnersOpen(!partnersOpen)}
              onMouseEnter={() => setPartnersOpen(true)}
              className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Users className="w-4 h-4 text-blue-600" /> Manage Partners <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {partnersOpen && (
              <div className="absolute top-full left-0 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                <Link
                  href="/b2b/partners"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Sub-Agencies & Partners
                </Link>
                <Link
                  href="/b2b/partners?tab=register"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Register Sub-Agent
                </Link>
              </div>
            )}
          </div>

          {/* Agency Settings Dropdown */}
          <div className="relative" onMouseLeave={() => setSettingsOpen(false)}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              onMouseEnter={() => setSettingsOpen(true)}
              className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Settings className="w-4 h-4 text-amber-600" /> Agency Settings <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {settingsOpen && (
              <div className="absolute top-full left-0 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                <Link
                  href="/b2b/agency-profile"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Agency Profile & Branding
                </Link>
                <Link
                  href="/b2b/markups"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Custom Markup Rules
                </Link>
                <Link
                  href="/b2b/fund-transfer"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Online Fund Transfer
                </Link>
              </div>
            )}
          </div>

          {/* My Account Dropdown */}
          <div className="relative" onMouseLeave={() => setAccountOpen(false)}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              onMouseEnter={() => setAccountOpen(true)}
              className="px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4 text-purple-600" /> My Account <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {accountOpen && (
              <div className="absolute top-full right-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                <Link
                  href="/b2b/agency-profile"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  Agency Profile
                </Link>
                <Link
                  href="/my-bookings"
                  className="block px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all text-xs"
                >
                  My Agent Bookings
                </Link>
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-all text-xs"
                >
                  Sign Out B2B
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
