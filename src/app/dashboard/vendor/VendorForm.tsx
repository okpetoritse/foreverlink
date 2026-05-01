"use client";

import { useState } from "react";
import { updateVendorProfile } from "@/actions/vendor";

export default function VendorForm({ vendor, tier }: { vendor: any, tier: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      businessName: formData.get("businessName") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      websiteUrl: formData.get("websiteUrl") as string,
    };

    const result = await updateVendorProfile(data);
    
    if (result.success) {
      setMessage("✅ Profile successfully updated and live in the Directory.");
    } else {
      setMessage("❌ " + result.error);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-8 max-w-2xl shadow-2xl relative overflow-hidden">
      {/* Tier Badge */}
      <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-xs font-bold px-4 py-2 uppercase tracking-widest rounded-bl-xl">
        {tier === "VENDOR_ELITE" ? "Premium Elite Partner" : "Verified Partner"}
      </div>

      <h2 className="text-2xl font-serif font-bold text-white mb-2">Vendor Profile Settings</h2>
      <p className="text-sm text-[#F5F5DC]/70 mb-8">Update how your business appears to families in the network directory.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Business Name</label>
          <input 
            type="text" 
            name="businessName"
            defaultValue={vendor.businessName}
            required
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Business Category</label>
          <input 
            type="text" 
            name="category"
            defaultValue={vendor.category}
            placeholder="e.g., Estate Lawyer, Genealogist, Photographer"
            required
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Description (Pitch to Families)</label>
          <textarea 
            name="description"
            defaultValue={vendor.description || ""}
            rows={4}
            required
            placeholder="Explain exactly how your services can help families secure their legacy..."
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Website URL (Optional)</label>
          <input 
            type="url" 
            name="websiteUrl"
            defaultValue={vendor.websiteUrl || ""}
            placeholder="https://yourbusiness.com"
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-sm font-bold ${message.includes("✅") ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? "Saving Profile..." : "Save & Update Directory"}
        </button>
      </form>
    </div>
  );
}