"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RazorpayModal from "./RazorpayModal";
import { User, Mail, Phone, Calendar, Loader2 } from "lucide-react";

export default function CheckoutForm({ offer }: { offer: any }) {
  const router = useRouter();
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "mr",
    given_name: "John",
    family_name: "Doe",
    gender: "m",
    born_on: "1990-01-01",
    email: "john.doe@example.com",
    phone_number: "+919876543210"
  });

  // Calculate total amount in INR roughly if it's USD/GBP
  const rawPrice = parseFloat(offer.total_amount);
  let priceInINR = rawPrice;
  if (offer.total_currency === "USD") priceInINR = rawPrice * 83.5;
  if (offer.total_currency === "GBP") priceInINR = rawPrice * 105.2;
  if (offer.total_currency === "EUR") priceInINR = rawPrice * 89.4;
  const finalAmount = Math.round(priceInINR);

  const handlePaymentSuccess = async (paymentId: string) => {
    setShowRazorpay(false);
    setIsBooking(true);

    try {
      const res = await fetch("/api/flights/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          passenger: formData,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      // Redirect to the e-ticket page
      router.push(`/ticket/${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
      setIsBooking(false);
    }
  };

  if (isBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-midnight-navy">Confirming your booking...</h2>
        <p className="text-gray-500 mt-2">Generating PNR with the airline</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Passenger Details Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-midnight-navy mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gold" /> Passenger Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
              <select 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              >
                <option value="mr">Mr</option>
                <option value="ms">Ms</option>
                <option value="mrs">Mrs</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
              <input 
                type="text" 
                value={formData.given_name} 
                onChange={e => setFormData({...formData, given_name: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
              <input 
                type="text" 
                value={formData.family_name} 
                onChange={e => setFormData({...formData, family_name: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> Date of Birth</label>
              <input 
                type="date" 
                value={formData.born_on} 
                onChange={e => setFormData({...formData, born_on: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
              <select 
                value={formData.gender} 
                onChange={e => setFormData({...formData, gender: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-midnight-navy mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gold" /> Contact Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Phone className="w-3 h-3"/> Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone_number} 
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="text-xl font-bold text-midnight-navy mb-4">Fare Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Base Fare</span>
              <span>₹{(finalAmount * 0.85).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Taxes & Fees</span>
              <span>₹{(finalAmount * 0.15).toLocaleString("en-IN")}</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-lg font-bold text-midnight-navy">
              <span>Total Amount</span>
              <span>₹{finalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button 
            onClick={() => setShowRazorpay(true)}
            className="w-full btn-gold py-4 rounded-xl font-bold text-lg shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:-translate-y-0.5 transition-all"
          >
            Pay with Razorpay
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Safe and secure payments powered by Razorpay.
          </p>
        </div>
      </div>

      {/* Razorpay Modal */}
      <RazorpayModal 
        isOpen={showRazorpay}
        amount={finalAmount}
        email={formData.email}
        phone={formData.phone_number}
        onClose={() => setShowRazorpay(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
