"use client";

import { useState } from "react";
import { sendFamilyInvite } from "@/actions/network";
import { toast } from "sonner";

export default function InviteForm() {
  const [isSending, setIsSending] = useState(false);

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("targetEmail") as string;
    const toastId = toast.loading(`Encrypting invite for ${email}...`);

    try {
      const result = await sendFamilyInvite(formData);
      
      if (result?.success) {
        toast.success("Lineage bridge invite sent successfully.", { id: toastId });
        (e.target as HTMLFormElement).reset(); // Clear the form
      } else {
        toast.error(result?.error || "Failed to send invite.", { id: toastId });
      }
    } catch (error) {
      toast.error("A network error occurred.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#0A192F]/80 border border-[#D4AF37]/20 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 mb-6">
        <h2 className="text-xl font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Establish Lineage Bridge</h2>
        <p className="text-xs text-[#8892B0] max-w-md">
          Invite a family member to your network. Their connection will be securely mirrored in your lineage tree.
        </p>
      </div>

      <form onSubmit={handleInvite} className="relative z-10 space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] text-[#8892B0] uppercase tracking-wider font-bold">Relative's Email Address</label>
          <input 
            type="email" 
            name="targetEmail"
            required
            placeholder="family@example.com"
            className="w-full bg-[#050B14] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8892B0] uppercase tracking-wider font-bold">Structural Relationship</label>
            <select 
              name="relationshipType" 
              required
              defaultValue=""
              className="w-full bg-[#050B14] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none transition-colors appearance-none"
            >
              <option value="" disabled>Select relation...</option>
              {/* 🚀 EXACT PRISMA ENUM VALUES */}
              <option value="PARENT">Parent</option>
              <option value="CHILD">Child</option>
              <option value="SPOUSE">Spouse / Partner</option>
              <option value="SIBLING">Sibling</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8892B0] uppercase tracking-wider font-bold">Vault Security Clearance</label>
            <select 
              name="accessLevel" 
              required
              defaultValue="EXTENDED"
              className="w-full bg-[#050B14] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none transition-colors appearance-none"
            >
              <option value="EXTENDED">Extended (Standard Access)</option>
              <option value="INNER">Inner Circle (High Clearance)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSending}
            className="w-full bg-[#D4AF37] text-[#050B14] font-bold uppercase tracking-widest py-4 rounded text-xs hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
          >
            {isSending ? (
              "Transmitting Invite..."
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Send Encrypted Invite
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}