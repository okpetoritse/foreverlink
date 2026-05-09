"use client";

import { useState } from "react";
import { acceptFamilyInvite } from "@/actions/network";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AcceptButton({ token }: { token: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Executing cryptographic handshake...");

    try {
      const result = await acceptFamilyInvite(token);
      
      if (result.success) {
        toast.success("Lineage bridge established successfully.", { id: toastId });
        // Send them straight to the Family Tree so they can see the new line!
        router.push("/dashboard/tree");
      } else {
        toast.error(result.error || "Handshake failed.", { id: toastId });
      }
    } catch (error) {
      toast.error("A network error occurred.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleAccept}
      disabled={isProcessing}
      className="w-full bg-[#D4AF37] text-[#050B14] font-bold uppercase tracking-widest py-4 rounded text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
    >
      {isProcessing ? "Forging Connection..." : "Accept & Establish Bridge"}
    </button>
  );
}