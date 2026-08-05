"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Percent,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Sliders,
} from "lucide-react";
import { mockMarkupRules, mockAgentProfile } from "@/lib/mock-data/agent";
import B2BHeader from "@/components/b2b/B2BHeader";

export default function AgentMarkupsPage() {
  const [rules, setRules] = useState(mockMarkupRules);
  const [newService, setNewService] = useState<"Flight" | "Hotel" | "Package" | "Transfer">("Flight");
  const [newProvider, setNewProvider] = useState("");
  const [newType, setNewType] = useState<"Percentage" | "Flat">("Percentage");
  const [newValue, setNewValue] = useState<number>(5.0);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `MK-0${rules.length + 1}`,
      service: newService,
      provider: newProvider || `${newService} Default Markup`,
      type: newType,
      value: newValue,
      appliedOn: "Net Fare" as const,
      active: true,
    };
    setRules([...rules, newRule]);
    setNewProvider("");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const toggleRuleActive = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

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
              <Percent className="w-8 h-8 text-amber-600" /> Agent Custom Markup Rules
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Set automated percentage (%) or flat fee (₹) markups on net agency fares for clients
            </p>
          </div>

          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs shadow-xs">
            <span className="text-slate-500">Agency: </span>
            <strong className="text-slate-900">{mockAgentProfile.agencyName}</strong>
          </div>
        </div>

        {/* Add New Markup Rule Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" /> Create New Markup Rule
          </h2>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> New Agent Markup Rule Added & Applied Live!
            </div>
          )}

          <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Travel Category
              </label>
              <select
                value={newService}
                onChange={(e) => setNewService(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Flight">Flights</option>
                <option value="Hotel">Hotels</option>
                <option value="Package">Holiday Packages</option>
                <option value="Transfer">Transfers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Provider / Sector Filter
              </label>
              <input
                type="text"
                placeholder="e.g. Emirates / International"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Markup Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Value ({newType === "Percentage" ? "%" : "₹"})
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={newValue}
                onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all"
              >
                <Plus className="w-4 h-4" /> Save Markup Rule
              </button>
            </div>
          </form>
        </div>

        {/* Existing Rules Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Active Agency Markup Configuration</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Rule ID</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Provider / Scope</th>
                  <th className="p-3.5">Markup Value</th>
                  <th className="p-3.5">Applied On</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-amber-700">{r.id}</td>
                    <td className="p-3.5 font-bold text-slate-900">{r.service}</td>
                    <td className="p-3.5 text-slate-600">{r.provider}</td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      {r.type === "Percentage" ? `${r.value}%` : `₹${r.value.toLocaleString("en-IN")}`}
                    </td>
                    <td className="p-3.5 text-slate-500">{r.appliedOn}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleRuleActive(r.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          r.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {r.active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleDeleteRule(r.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-all"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
