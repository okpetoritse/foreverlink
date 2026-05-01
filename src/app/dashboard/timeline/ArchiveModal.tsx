"use client";

import { useState } from "react";
import { archiveMilestone } from "@/actions/timeline";

export default function ArchiveModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* The Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-xs uppercase tracking-widest rounded hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-2"
      >
        <span>+</span> Archive Memory
      </button>

      {/* The Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#112240] border border-[#D4AF37]/30 rounded-md w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0A192F]">
              <h2 className="text-[#D4AF37] text-sm tracking-widest uppercase font-bold">
                New Archival Entry
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-[#F5F5DC]/50 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

           {/* 🚀 THE LIVE INPUT ENGINE */}
            {/* 🚀 THE STREAMLINED INPUT ENGINE */}
            <form 
              action={async (formData) => {
                await archiveMilestone(formData);
                setIsOpen(false); 
              }} 
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">Achievement / Memory Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Purchasing the Estate"
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">The Record (Details)</label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  placeholder="Document the details of this achievement..."
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">Attach Media (Photo / Video)</label>
                <input
                  type="file"
                  name="media"
                  accept="image/jpeg, image/png, image/webp, video/mp4, video/quicktime"
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2 rounded focus:border-[#D4AF37] focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20"
                />
              </div>

              {/* 🔒 THE ONLY TOGGLE THAT MATTERS */}
              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">Privacy Lock</label>
                <select name="clearance" required defaultValue="" className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none">
                  <option value="" disabled>Select Privacy Level...</option>
                  <option value="EXTENDED">🌐 Public Memory (Visible to entire Connected Network)</option>
                  <option value="INNER_CIRCLE">🔒 Closed Circle Memory (Strict Lineage Lock)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-transparent border border-[#233554] text-[#8892B0] text-xs uppercase tracking-widest py-3 rounded hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-widest py-3 rounded hover:bg-[#D4AF37]/20 transition-colors">
                  Save to Gallery
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}