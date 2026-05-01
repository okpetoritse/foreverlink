"use client";

import Script from "next/script";
import { useState } from "react";

interface StorageUpgradeButtonProps {
  userId: string;
  email: string;
}

export default function StorageUpgradeButton({ userId, email }: StorageUpgradeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const payWithPaystack = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      alert("Payment configuration is missing. Please contact support.");
      return;
    }

    setIsProcessing(true);

    try {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: 499 * 100,
        currency: "NGN",
        metadata: {
          userId,
          custom_fields: [
            {
              display_name: "Upgrade Type",
              variable_name: "upgrade_type",
              value: "storage",
            },
          ],
        },
        callback: function () {
          alert("Payment Successful! Your storage is being upgraded.");
          window.location.reload();
        },
        onClose: function () {
          console.log("Payment window closed.");
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack initialization failed:", error);
      alert("Unable to launch payment. Please try again later.");
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={() => {
        payWithPaystack();
      }}
      disabled={isProcessing}
      className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
    >
      {isProcessing ? "Processing..." : "Upgrade Storage ($4.99)"}
    </button>
  );
}