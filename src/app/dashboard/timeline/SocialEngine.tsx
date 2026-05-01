"use client";

import { toggleStar, addComment } from "@/actions/social";
import { useRef } from "react";

export default function SocialEngine({ 
  milestoneId, 
  likesCount, 
  hasLiked, 
  comments 
}: { 
  milestoneId: string;
  likesCount: number;
  hasLiked: boolean;
  comments: any[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {/* ⭐ Star Button */}
      <div className="flex items-center gap-4 mb-6">
        <form action={async () => { await toggleStar(milestoneId); }}>
          <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
            hasLiked 
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
              : 'bg-black/20 border-white/10 text-[#8892B0] hover:text-[#D4AF37] hover:border-[#D4AF37]/30'
          }`}>
            <svg className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span className="text-sm font-bold">{likesCount}</span>
          </button>
        </form>
      </div>

      {/* 💬 Comments Section */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        {/* Render Live Comments */}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#050B14]/50 p-4 rounded-lg border border-white/5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-[#F5F5DC]">{comment.author.name}</span>
              <span className="text-[10px] text-[#8892B0]">
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(comment.createdAt)}
              </span>
            </div>
            <p className="text-xs text-[#8892B0] font-sans">{comment.text}</p>
          </div>
        ))}

        {/* Input Area */}
        <form 
          ref={formRef}
          action={async (formData) => {
            await addComment(formData);
            formRef.current?.reset(); // Clears the input after posting
          }} 
          className="flex gap-3 pt-2"
        >
          <input type="hidden" name="milestoneId" value={milestoneId} />
          <input 
            type="text" 
            name="text"
            required
            placeholder="Leave a message for the archive..." 
            className="flex-1 bg-black/40 border border-[#233554] rounded-md px-4 py-2.5 text-sm text-[#CCD6F6] focus:border-[#D4AF37] focus:outline-none transition-colors"
          />
          <button type="submit" className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/50 rounded-md hover:bg-[#D4AF37]/10 transition-colors">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}