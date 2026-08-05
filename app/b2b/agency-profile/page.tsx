"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import B2BHeader from "@/components/b2b/B2BHeader";
import { mockAgentProfile } from "@/lib/mock-data/agent";

export default function AgencyProfilePage() {
  const [profile, setProfile] = useState(mockAgentProfile);
  const [saved, setSaved] = useState(false);
  const [voucherHeader, setVoucherHeader] = useState("Skyline Travels - Your Trusted Global Partner");
  const [voucherFooter, setVoucherFooter] = useState("Thank you for booking with Skyline Travels! 24/7 Helpline: +91 98765 43210");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <B2BHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
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
              <Settings className="w-8 h-8 text-amber-600" /> Agency Profile & Voucher Branding
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure your agency logo, GST registration, and custom client voucher headers & footers
            </p>
          </div>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile & Branding Settings Saved!
            </div>
          )}
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Agency Details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" /> General Agency Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={profile.agencyName}
                  onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Manager</label>
                <input
                  type="text"
                  value={profile.contactPerson}
                  onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Work Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={profile.gstin}
                  onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">IATA Code (Optional)</label>
                <input
                  type="text"
                  value={profile.iataCode || ""}
                  onChange={(e) => setProfile({ ...profile, iataCode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Client Voucher Branding */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Client Voucher Custom Branding
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Voucher Header Text</label>
                <input
                  type="text"
                  value={voucherHeader}
                  onChange={(e) => setVoucherHeader(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Voucher Footer & Terms Text</label>
                <textarea
                  rows={3}
                  value={voucherFooter}
                  onChange={(e) => setVoucherFooter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-xs shadow-md transition-all"
            >
              Save Agency Profile & Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
