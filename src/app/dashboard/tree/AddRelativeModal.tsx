"use client";

import { useState } from "react";
import { addAchievement } from "@/actions/achievements";

export default function AddMilestoneModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    const result = await addAchievement(formData);
    setIsSaving(false);
    
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert("Something went wrong saving to the vault.");
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#D4AF37] text-[#0A192F] px-4 md:px-6 py-2.5 rounded-md font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2 text-sm md:text-base w-full md:w-auto justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Archive Milestone
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm sm:px-4 pb-20 md:pb-0">
          {/* Mobile-first design: slides up from the bottom on phones, centered on desktop */}
          <div className="bg-[#0A192F] border border-white/10 rounded-t-3xl md:rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:fade-in duration-300 max-h-[85vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-[#0A192F]/95 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center z-10">
              <h2 className="text-xl font-serif font-bold text-[#D4AF37]">Record Achievement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#F5F5DC]/50 hover:text-white bg-white/5 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form action={handleSave}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#F5F5DC]/70 mb-1.5">Award / Milestone Title</label>
                  <input name="title" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-white/20" placeholder="e.g. Forbes 30 Under 30" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5DC]/70 mb-1.5">Date Achieved</label>
                  {/* Native date picker for great mobile UX */}
                  <input name="dateEarned" required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all [color-scheme:dark]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5DC]/70 mb-1.5">Legacy Description</label>
                  <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all resize-none placeholder:text-white/20" placeholder="Tell the story behind this success for the next generation..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5DC]/70 mb-1.5">Media Link (Optional)</label>
                  <input name="mediaUrl" type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/20" placeholder="https://link-to-news-article-or-video.com" />
                </div>
              </div>

              <div className="p-6 pt-0 border-white/10 flex gap-3 mt-4">
                <button type="submit" disabled={isSaving} className="w-full bg-[#D4AF37] text-[#0A192F] px-6 py-3.5 rounded-xl font-bold hover:bg-white disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#0A192F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Locking into Vault...
                    </>
                  ) : "Save to Digital Legacy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}