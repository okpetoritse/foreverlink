"use client";

import { useState } from "react";
import Script from "next/script";

interface FamilyUpgradeButtonProps {
  userId: string;
  email: string;
}

export default function FamilyUpgradeButton({ userId, email }: FamilyUpgradeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const payWithPaystack = () => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // Professional Safety Check: 
  if (!publicKey) {
    console.error("Environment Variable Error: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is missing!");
    alert("System configuration error. Please contact support.");
    return;
  }

  setIsProcessing(true);
  // ... rest of your code

    // 🛡️ HERE IT IS: We define safeEmail right before Paystack uses it!
    const safeEmail = email && email.includes("@") ? email : "billing@foreverlink.app";
    
    try {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
  key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  email: safeEmail,
  amount: 5000 * 100, // 5,000 Naira (or whatever test amount you prefer)
  currency: "NGN", // Change this to "NGN"
  // ... rest of code
        metadata: {
          userId: userId,
          custom_fields: [
            {
              display_name: "Upgrade Type",
              variable_name: "upgrade_type",
              value: "storage",
            }
          ]
        },
        callback: function (response: any) {
          alert("Payment Successful! Your vault storage has been expanded.");
          window.location.reload();
        },
        onClose: function () {
          console.log("Payment window closed.");
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack Error:", error);
      alert("Could not load checkout. Please check your internet connection.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" />
      
      <button
        type="button"
        onClick={payWithPaystack}
        disabled={isProcessing}
        className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 disabled:opacity-50"
      >
        {isProcessing ? "Loading Checkout..." : "Upgrade Vault Storage ($4.99)"}
      </button>
    </>
  );
}