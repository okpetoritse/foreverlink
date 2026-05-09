"use client";

import { useState, useRef } from "react";
import { updateVendorProfile } from "@/actions/vendor";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function VendorForm({ vendor, tier }: { vendor: any, tier: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Initialize with their existing logo from the database, or leave blank
  const [logoUrl, setLogoUrl] = useState(vendor?.logoUrl || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isElite = tier === "VENDOR_ELITE";

  // 🚀 1. THE DIRECT UPLOAD ENGINE (Bypasses Vercel)
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Logo must be less than 10MB.');
      }

      const toastId = toast.loading('Securing company logo...');

      const fileExt = file.name.split('.').pop();
      const fileName = `vendor-logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('milestone_media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('milestone_media')
        .getPublicUrl(fileName);
      
      setLogoUrl(publicUrl);
      toast.success('Logo uploaded securely. Save profile to lock it in.', { id: toastId });

    } catch (error: any) {
      toast.error(error.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // 🚀 2. YOUR FLAWLESS BACKEND CONNECTION
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const toastId = toast.loading('Updating public directory...');

    const formData = new FormData(e.currentTarget);
    const data = {
      businessName: formData.get("businessName") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      logoUrl: logoUrl, // ✅ Automatically inject the uploaded URL here!
    };

    const result = await updateVendorProfile(data);
    
    if (result.success) {
      toast.success("Storefront updated successfully.", { id: toastId });
      setMessage("✅ Profile successfully updated and live in the Directory.");
    } else {
      toast.error(result.error, { id: toastId });
      setMessage("❌ " + result.error);
    }
    
    setIsLoading(false);
  }

  // 🚀 3. THE PREMIUM UI
  return (
    <div className="bg-[#0A192F]/90 border border-[#D4AF37]/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden">
      
      {/* Tier Badge */}
      <div className={`absolute top-0 right-0 text-[#050B14] text-[10px] font-bold px-4 py-2 uppercase tracking-widest rounded-bl-xl shadow-lg ${isElite ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8529]' : 'bg-blue-400'}`}>
        {isElite ? "Premium Elite Partner" : "Verified Partner"}
      </div>

      <div className="mb-8 border-b border-white/5 pb-8">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Partner Storefront</h2>
        <p className="text-sm text-[#8892B0]">Upload your logo and configure your public listing.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 📸 HIDDEN UPLOAD TRICK FOR LOGO */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
          <div className="relative group shrink-0">
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`w-24 h-24 rounded-full bg-[#050B14] border-2 ${isElite ? 'border-[#D4AF37]' : 'border-blue-500/50'} flex items-center justify-center overflow-hidden cursor-pointer relative transition-all shadow-inner ${isUploading ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Vendor Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-[#8892B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] uppercase font-bold text-white tracking-widest text-center px-2">
                  {isUploading ? 'Securing...' : 'Upload Logo'}
                </span>
              </div>
            </div>
            {/* The Hidden Input */}
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
          </div>

          <div className="flex-1 text-center sm:text-left pt-2">
            <h3 className="text-white font-bold tracking-wide mb-1">Business Identity</h3>
            <p className="text-xs text-[#8892B0] max-w-sm">
              Square images work best. Max size 10MB. This will be displayed on the public network directory.
            </p>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Business Name</label>
            <input 
              type="text" 
              name="businessName"
              defaultValue={vendor.businessName}
              required
              className="w-full bg-[#050B14] border border-[#233554] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Business Category</label>
            <input 
              type="text" 
              name="category"
              defaultValue={vendor.category}
              placeholder="e.g., Estate Lawyer, Genealogist"
              required
              className="w-full bg-[#050B14] border border-[#233554] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Website URL (Optional)</label>
          <input 
            type="url" 
            name="websiteUrl"
            defaultValue={vendor.websiteUrl || ""}
            placeholder="https://yourbusiness.com"
            className="w-full bg-[#050B14] border border-[#233554] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Storefront Pitch</label>
          <textarea 
            name="description"
            defaultValue={vendor.description || ""}
            rows={4}
            required
            maxLength={300}
            placeholder="Explain exactly how your services can help families secure their legacy (Max 300 characters)..."
            className="w-full bg-[#050B14] border border-[#233554] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
          ></textarea>
        </div>

        {message && (
          <div className={`p-4 rounded text-xs font-bold uppercase tracking-widest border ${message.includes("✅") ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30" : "bg-red-900/20 text-red-400 border-red-500/30"}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="w-full bg-[#D4AF37] text-[#0A192F] font-bold uppercase tracking-widest py-4 rounded hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
        >
          {isLoading ? "Saving Profile..." : "Save & Update Directory"}
        </button>
      </form>
    </div>
  );
}