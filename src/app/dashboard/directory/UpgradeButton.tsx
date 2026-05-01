"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/paystack";

export default function UpgradeButton({ 
  tier, 
  label, 
  description 
}: { 
  tier: "VENDOR_VERIFIED" | "VENDOR_ELITE";
  label: string;
  description: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    
    // Call the Paystack engine we just built
    const response = await createCheckoutSession(tier);
    
    if (response?.url) {
      // If Paystack gives us the green light, we instantly route the user to the checkout page
      window.location.href = response.url;
    } else {
      alert("Checkout Initialization Failed: " + response?.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#0A192F] to-black border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#D4AF37]/50 transition-colors shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
      <p className="text-sm text-[#F5F5DC]/70 mb-6">{description}</p>
      
      <button 
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Connecting...
          </>
        ) : (
          "Purchase Subscription"
        )}
      </button>
    </div>
  );
}