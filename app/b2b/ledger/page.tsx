"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  Download,
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { mockLedgerTransactions, mockAgentProfile } from "@/lib/mock-data/agent";
import B2BHeader from "@/components/b2b/B2BHeader";

export default function AgentLedgerPage() {
  const [transactions, setTransactions] = useState(mockLedgerTransactions);
  const [filterType, setFilterType] = useState<"All" | "Credit" | "Debit">("All");

  const filteredTxns = transactions.filter((t) => {
    if (filterType === "All") return true;
    return t.type === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <B2BHeader />

      <div className="max-w-6xl mx-auto space-y-8 pt-6 px-4 sm:px-6 lg:px-8">
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
              <FileText className="w-8 h-8 text-emerald-600" /> Agency Wallet & Financial Ledger
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Detailed record of deposit top-ups, booking debits, refunds, TDS deductions, and commission payouts
            </p>
          </div>

          <button
            onClick={() => alert("Downloading Monthly PDF Statement...")}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export PDF Statement
          </button>
        </div>

        {/* Ledger Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-600" /> Current Wallet Balance
            </span>
            <div className="text-2xl font-black text-slate-900">
              ₹{mockAgentProfile.walletBalance.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Approved Credit Line
            </span>
            <div className="text-2xl font-black text-slate-900">
              ₹{mockAgentProfile.creditLimit.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Total Deposits This Month
            </span>
            <div className="text-2xl font-black text-emerald-600">
              ₹1,34,500
            </div>
          </div>
        </div>

        {/* Filter & Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Transaction Statement</h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(["All", "Credit", "Debit"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === type
                      ? "bg-slate-900 text-amber-400 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Txn Ref ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 rounded-r-xl">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-mono text-amber-700 font-bold">{t.id}</td>
                    <td className="p-3.5 text-slate-600">{t.date}</td>
                    <td className="p-3.5 font-bold text-slate-900">{t.description}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg text-[10px] text-slate-800 font-semibold">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.type === "Credit"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {t.type === "Credit" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`p-3.5 font-bold ${
                        t.type === "Credit" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {t.type === "Credit" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{t.balanceAfter.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
