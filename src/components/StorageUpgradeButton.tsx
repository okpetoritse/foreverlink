"use client";

import { usePaystackPayment } from "react-paystack";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface StorageUpgradeButtonProps {
  userId: string;
  email: string;
}

export default function StorageUpgradeButton({ userId, email }: StorageUpgradeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const config = {
    reference: `FL_STORAGE_${new Date().getTime()}`,
    email: email,
    amount: 499 * 100, // $4.99 in subunits
    currency: "USD",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      userId: userId,
      custom_fields: [
        {
          display_name: "Upgrade Type",
          variable_name: "upgrade_type",
          value: "storage", // CRITICAL: Tells the webhook what this payment is for
        }
      ]
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    setIsProcessing(true);
    alert("Payment Successful! Your storage is being upgraded.");
    // Force a hard refresh so the UI updates with their new storage limit
    window.location.reload(); 
  };

  const onClose = () => {
    console.log("Payment window closed.");
  };

  return (
    <button
      onClick={() => {
        initializePayment({ onSuccess, onClose });
      }}
      disabled={isProcessing}
      className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
    >
      {isProcessing ? "Processing..." : "Upgrade Storage ($4.99)"}
    </button>
  );
}