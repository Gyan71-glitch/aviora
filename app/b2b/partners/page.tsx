"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import B2BHeader from "@/components/b2b/B2BHeader";

interface SubAgency {
  id: string;
  agencyName: string;
  managerName: string;
  email: string;
  phone: string;
  city: string;
  creditLimit: number;
  creditUsed: number;
  status: "Active" | "Pending Approval";
  joinedDate: string;
}

const mockSubAgencies: SubAgency[] = [
  {
    id: "SUB-8810",
    agencyName: "Apex Travels Delhi",
    managerName: "Anil Verma",
    email: "anil@apextravels.com",
    phone: "+91 98112 33445",
    city: "Delhi",
    creditLimit: 200000,
    creditUsed: 45000,
    status: "Active",
    joinedDate: "2024-01-15",
  },
  {
    id: "SUB-8812",
    agencyName: "Royal Holidays Jaipur",
    managerName: "Vikram Rathore",
    email: "vikram@royalholidays.in",
    phone: "+91 94140 12345",
    city: "Jaipur",
    creditLimit: 150000,
    creditUsed: 12000,
    status: "Active",
    joinedDate: "2024-03-10",
  },
  {
    id: "SUB-8819",
    agencyName: "Green Palm Tours Kochi",
    managerName: "Mathew Joseph",
    email: "mathew@greenpalm.com",
    phone: "+91 98470 99887",
    city: "Kochi",
    creditLimit: 100000,
    creditUsed: 0,
    status: "Pending Approval",
    joinedDate: "2026-07-28",
  },
];

export default function ManagePartnersPage() {
  const [subAgencies, setSubAgencies] = useState<SubAgency[]>(mockSubAgencies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCreditLimit, setNewCreditLimit] = useState(100000);
  const [success, setSuccess] = useState(false);

  const handleRegisterSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: SubAgency = {
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      agencyName: newAgencyName,
      managerName: newManager,
      email: newEmail,
      phone: newPhone,
      city: newCity,
      creditLimit: newCreditLimit,
      creditUsed: 0,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setSubAgencies([...subAgencies, newAgent]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAddModal(false);
      setNewAgencyName("");
      setNewManager("");
      setNewEmail("");
      setNewPhone("");
      setNewCity("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <B2BHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Top Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Link
              href="/b2b"
              className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Agent Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" /> Manage Partners & Sub-Agencies
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Register sub-agents, allocate credit limits, and track sub-agency bookings & commissions
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" /> Register New Sub-Agent
          </button>
        </div>

        {/* Sub-Agencies Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Registered Sub-Agency Partners ({subAgencies.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Agency ID</th>
                  <th className="p-3.5">Agency Name</th>
                  <th className="p-3.5">Contact Manager</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Credit Limit</th>
                  <th className="p-3.5">Used Limit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-amber-700">{agency.id}</td>
                    <td className="p-3.5 font-bold text-slate-900">{agency.agencyName}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{agency.managerName}</div>
                      <div className="text-[10px] text-slate-500">{agency.email} • {agency.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">{agency.city}</td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      ₹{agency.creditLimit.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">
                      ₹{agency.creditUsed.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          agency.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {agency.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => alert(`Managing Credit Limit for ${agency.agencyName}...`)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 font-bold text-[11px]"
                      >
                        Edit Limit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sub-Agent Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold">Register New Sub-Agency Partner</h3>
            <p className="text-xs text-slate-500">
              Add a new sub-agency under your MTTPL main account and allocate credit limits.
            </p>

            {success ? (
              <div className="py-8 text-center space-y-2 text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                <h4 className="font-bold text-lg text-slate-900">Sub-Agency Registered!</h4>
                <p className="text-xs text-slate-500">Credentials have been dispatched to {newEmail}.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubAgent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Agency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Speedwing Travels"
                    value={newAgencyName}
                    onChange={(e) => setNewAgencyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      placeholder="Manager Name"
                      value={newManager}
                      onChange={(e) => setNewManager(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="subagent@travels.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Allocated Credit Limit (INR)</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                  >
                    Register Sub-Agent
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
