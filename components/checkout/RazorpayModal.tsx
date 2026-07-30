"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, CreditCard, Smartphone, Building, Wallet, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  email: string;
  phone: string;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export default function RazorpayModal({
  isOpen,
  amount,
  email,
  phone,
  onClose,
  onSuccess,
}: RazorpayModalProps) {
  const [step, setStep] = useState<"methods" | "card" | "processing" | "success">("methods");

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep("methods");
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayClick = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess("pay_" + Math.random().toString(36).substring(2, 10));
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0c2340] text-white p-5 flex flex-col items-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-midnight-navy">AV</span>
          </div>
          <h3 className="font-medium text-lg mb-1">Aviora Travel</h3>
          <div className="text-2xl font-bold flex items-center">
            <span className="text-sm opacity-80 mr-1">₹</span>
            {amount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="bg-gray-50 border-b border-gray-100 p-3 text-xs flex justify-between text-gray-500">
          <div className="truncate pr-2">{email}</div>
          <div className="shrink-0">{phone}</div>
        </div>

        {/* Content Area */}
        <div className="p-5 min-h-[300px]">
          
          {step === "methods" && (
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cards, UPI & More</div>
              
              <button onClick={() => setStep("card")} className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-[#3399cc] hover:bg-blue-50/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-[#3399cc]">Card</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3399cc]" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-[#3399cc] hover:bg-blue-50/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700">UPI / QR</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-[#3399cc] hover:bg-blue-50/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700">Netbanking</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          )}

          {step === "card" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Enter Card Details</div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Card Number</label>
                  <input type="text" value="4242 4242 4242 4242" readOnly className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 font-mono" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Expiry</label>
                    <input type="text" value="12/28" readOnly className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 font-mono" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">CVV</label>
                    <input type="password" value="123" readOnly className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 font-mono" />
                  </div>
                </div>
                <button 
                  onClick={handlePayClick}
                  className="w-full bg-[#3399cc] text-white py-3.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#2b83b0] transition-colors mt-2"
                >
                  Pay ₹{amount.toLocaleString("en-IN")}
                </button>
                <button 
                  onClick={() => setStep("methods")}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2"
                >
                  Back to methods
                </button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px]">
              <Loader2 className="w-12 h-12 text-[#3399cc] animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-600">Processing payment...</p>
              <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-800">Payment Successful</p>
              <p className="text-xs text-gray-500 mt-1">Redirecting...</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 flex justify-center items-center gap-1.5 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">Secured by</span>
          <span className="text-[12px] font-bold text-[#3399cc] tracking-tight">Razorpay</span>
        </div>
      </div>
    </div>
  );
}
