"use client";

import { useState, useRef } from "react";
import { sealTimeVault } from "@/actions/vaults"; // 👈 Updated to point to our new engine

export default function SealVaultModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    // Call the newly upgraded secure server engine
    const result = await sealTimeVault(formData);
    setIsSaving(false);
    
    if (result?.success) {
      setIsModalOpen(false);
      setSelectedFileName(null);
    } else {
      alert("Encryption failed. Please try again.");
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full md:w-auto bg-[#D4AF37] text-[#0A192F] px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2 group"
      >
        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Seal New Vault
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          
          {/* 🧱 THE MASTER CONTAINER */}
          <div className="bg-[#0A192F] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden animate-in fade-in duration-300">
            
            {/* 📌 HEADER */}
            <div className="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#0A192F] shrink-0">
              <h2 className="text-xl font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Seal a New Vault
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#F5F5DC]/50 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* FORM */}
            <form action={handleSave} className="flex flex-col flex-1 overflow-hidden">
              
              {/* 📜 SCROLLABLE BODY */}
              <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs text-[#F5F5DC]/70 mb-1">Vault Name *</label>
                  <input name="title" required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Letters to my Great-Grandchildren" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#D4AF37] mb-1 font-bold">Unlock Date *</label>
                    <input name="unlockDate" required type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#F5F5DC]/70 mb-1">Target Generation</label>
                    <select name="generation" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer">
                      <option className="bg-[#0A192F]">Next Generation (Gen 2)</option>
                      <option className="bg-[#0A192F]">Grandchildren (Gen 3)</option>
                      <option className="bg-[#0A192F]">Great-Grandchildren (Gen 4)</option>
                    </select>
                  </div>
                </div>

                {/* 🆕 THE NEW SECRET MESSAGE FIELD */}
                <div>
                  <label className="block text-xs text-[#F5F5DC]/70 mb-1">Secret Message (Optional)</label>
                  <textarea 
                    name="content" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] resize-none" 
                    placeholder="Type a message that no one can read until the timer hits zero..."
                  ></textarea>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer mt-4"
                >
                  <svg className="w-8 h-8 text-[#D4AF37] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  
                  {selectedFileName ? (
                    <p className="text-sm font-bold text-[#D4AF37] mb-1 truncate w-full px-4">{selectedFileName}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-white mb-1">Select files to lock</p>
                      <p className="text-xs text-[#F5F5DC]/50">Documents, Photos, or Videos</p>
                    </>
                  )}
                  
                  {/* 👈 Note: Changed name to "media" to match the server action exactly */}
                  <input 
                    type="file" 
                    name="media" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Once sealed, these files will be cryptographically locked. You will not be able to edit or delete them, and they cannot be accessed until the specified date.
                  </p>
                </div>
              </div>

              {/* 📌 FOOTER */}
              <div className="p-5 md:p-6 border-t border-white/10 bg-[#0A192F] flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg font-medium text-[#F5F5DC]/70 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="w-full sm:w-auto bg-[#D4AF37] text-[#0A192F] px-6 py-3 sm:py-2 rounded-lg font-bold hover:bg-white disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                  {isSaving ? "Encrypting..." : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Seal & Encrypt
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}