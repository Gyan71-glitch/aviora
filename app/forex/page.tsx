"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function ForexPage() {
  useEffect(() => {
    window.open("https://forexxmate.netlify.app/", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center pt-28 pb-20">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-md text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-6 h-6 text-gold-dark" />
        </div>
        <h2 className="font-display text-2xl font-bold text-midnight-navy mb-2">
          Redirecting to ForexxMate
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Transferring you to our official MTTPL Forex partner website...
        </p>
        <a
          href="https://forexxmate.netlify.app/"
          className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs inline-block shadow-md"
        >
          Click here if not redirected
        </a>
      </div>
    </main>
  );
}
