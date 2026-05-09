"use client";

import { useState, useRef } from "react";
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";
import { updateUserProfile } from "@/actions/profile";

export default function SettingsForm({ user }: { user: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load their existing avatar or fall back to initials
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}&backgroundColor=0A192F&textColor=D4AF37`;
  const [avatarUrl, setAvatarUrl] = useState(user.image || defaultAvatar); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 20 * 1024 * 1024) {
        throw new Error('Avatar must be less than 20MB.');
      }

      const toastId = toast.loading('Securing new identity credential...');

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('milestone_media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('milestone_media')
        .getPublicUrl(fileName);
      
      setAvatarUrl(publicUrl);
      toast.success('Identity credential uploaded. Save profile to lock it in.', { id: toastId });

    } catch (error: any) {
      toast.error(error.message || 'Avatar upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (formData: FormData) => {
    setIsSaving(true);
    const toastId = toast.loading('Locking profile data...');

    const data = {
      name: formData.get("name") as string,
      image: avatarUrl, // Grab the live avatar URL from state
    };

    const result = await updateUserProfile(data);

    if (result.success) {
      toast.success('Profile locked and secured.', { id: toastId });
    } else {
      toast.error(result.error || 'Failed to secure profile.', { id: toastId });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-12">
      {/* 🛡️ CARD 1: PUBLIC IDENTITY */}
      <form action={handleSaveProfile} className="bg-[#0A192F]/80 border border-white/5 rounded-xl p-8 shadow-2xl">
        <h2 className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase mb-6 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Public Identity
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
          {/* THE HIDDEN INPUT TRICK */}
          <div className="relative group shrink-0">
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`w-24 h-24 rounded-full border-2 border-[#D4AF37]/30 overflow-hidden cursor-pointer relative transition-all ${isUploading ? 'opacity-50' : 'hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'}`}
            >
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest text-center px-2">
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/jpeg, image/png, image/webp" className="hidden" />
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Display Name</label>
              <input 
                name="name"
                type="text" 
                required
                defaultValue={user.name || ""}
                className="w-full bg-[#050B14] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none transition-colors" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button type="submit" disabled={isSaving || isUploading} className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50">
            {isSaving ? "Securing..." : "Update Profile"}
          </button>
        </div>
      </form>

      {/* 🔒 CARD 2: ACCOUNT & BILLING */}
      <div className="bg-[#0A192F]/80 border border-white/5 rounded-xl p-8 shadow-2xl">
        <h2 className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase mb-6 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Account Security & Billing
        </h2>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Primary Email Address</label>
            <input 
              type="email" 
              disabled
              defaultValue={user.email}
              className="w-full bg-[#050B14]/50 border border-[#233554]/50 text-[#8892B0] p-3 rounded text-sm cursor-not-allowed" 
            />
            <p className="text-[10px] text-[#8892B0] mt-1 italic">Email cannot be changed directly for security purposes.</p>
          </div>

          {/* Premium Storage Card inside the Settings */}
          <div className="mt-8 bg-gradient-to-br from-[#112240] to-[#0A192F] border border-[#D4AF37]/20 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-[#F5F5DC] text-sm font-bold tracking-wide">Standard Storage Plan</h3>
                <p className="text-xs text-[#8892B0] mt-1 max-w-sm leading-relaxed">
                  You are currently on the baseline tier. Upgrade to unlock expanded Time Vault storage for generations.
                </p>
              </div>
              
              <button className="shrink-0 bg-[#D4AF37] text-[#0A192F] px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                Upgrade Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}