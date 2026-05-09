"use client";

import { useState } from "react";
import { archiveMilestone } from "@/actions/timeline";
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";

export default function ArchiveModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (isUploading) return;
    setIsUploading(true);
    const toastId = toast.loading('Securing memories in the vault...');

    try {
      const files = formData.getAll('media') as File[];
      const mediaUrls: string[] = [];

      // Upload Logic
      if (files.length > 0 && files[0].size > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('milestone_media')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('milestone_media')
            .getPublicUrl(fileName);
          
          mediaUrls.push(publicUrl);
        }
      }

      // Merge URLs back into form
      formData.set('media', mediaUrls.join(',')); 
      await archiveMilestone(formData);
      
      toast.success('Successfully Archived.', { id: toastId });
      setIsOpen(false); 

    } catch (error: any) {
      console.error(error);
      toast.error('Upload failed. Check your connection.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-xs uppercase tracking-widest rounded hover:bg-[#D4AF37]/20 transition-all flex items-center gap-2"
      >
        <span>+</span> Archive Memory
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#112240] border border-[#D4AF37]/30 rounded-lg w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0A192F] shrink-0">
              <h2 className="text-[#D4AF37] text-xs uppercase font-bold tracking-widest">New Archival Entry</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/50 p-2 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form action={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Memory Title</label>
                <input name="title" required placeholder="e.g., Graduation" className="w-full bg-[#0A192F] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Details</label>
                <textarea name="content" rows={3} placeholder="The story behind this moment..." className="w-full bg-[#0A192F] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Privacy Lock</label>
                <select name="clearance" required defaultValue="" className="w-full bg-[#0A192F] border border-[#233554] text-white p-3 rounded text-sm focus:border-[#D4AF37] outline-none appearance-none">
                  <option value="" disabled>Select Privacy Level...</option>
                  <option value="EXTENDED">🌐 Public Memory</option>
                  <option value="INNER_CIRCLE">🔒 Closed Circle Memory</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8892B0] uppercase tracking-wider">Attach Photos/Videos</label>
                <input name="media" type="file" multiple className="text-white text-[10px] w-full block file:bg-[#D4AF37]/10 file:text-[#D4AF37] file:border-0 file:py-2 file:px-3 file:rounded file:mr-3" />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-widest rounded transition-all ${isUploading ? 'bg-gray-700 text-gray-500' : 'bg-[#D4AF37] text-[#0A192F] hover:scale-[1.01] active:scale-95'}`}
                >
                  {isUploading ? "SECURING..." : "SAVE TO VAULT"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="w-full py-2 text-[#8892B0] text-[10px] uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}