import { auth, prisma } from "@/auth";
import ArchiveModal from "./ArchiveModal";
import SocialEngine from "./SocialEngine";

export default async function TimelinePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // 🚀 LIVE DATABASE: Fetching milestones AND their attached social data
  const milestones = await prisma.milestone.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      likes: true, 
      comments: {  
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Controls */}
        <div className="border-b border-[#D4AF37]/30 pb-4 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-2">
              The Lineage Archive
            </h1>
            <p className="text-xs text-[#F5F5DC]/50 mt-2 uppercase">Unified History & Achievements</p>
          </div>
          
          <ArchiveModal />
        </div>

        {/* 🏆 THE MASTER SPINE & GALLERY CARDS */}
        <div className="relative border-l border-[#D4AF37]/30 ml-4 md:ml-8 space-y-16 pb-24">
          
          {milestones.length === 0 ? (
            <div className="pl-10 md:pl-16 text-[#F5F5DC]/50 italic text-sm">
              Your archive is currently empty. Establish your first milestone to begin your legacy.
            </div>
          ) : (
            milestones.map((item) => {
              // Calculate social states
              const likesCount = item.likes.length;
              const hasLiked = item.likes.some(like => like.userId === userId);

              return (
                <div key={item.id} className="relative group">
                  
                  {/* The Glowing Timeline Dot */}
                  <div className="absolute w-5 h-5 bg-[#050B14] border-2 border-[#D4AF37] rounded-full -left-[11px] top-0 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                  
                  {/* The Gallery Card */}
                  <div className="ml-10 md:ml-16 bg-[#0A192F]/80 border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl relative">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-2xl font-serif font-bold text-white tracking-wide">{item.title}</h3>
                        <span className="text-[10px] px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full uppercase tracking-wider">
                          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(item.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[#8892B0]">
                        <span className="text-[10px] uppercase tracking-wider opacity-70">
                          {item.clearance === 'INNER_CIRCLE' ? '🔒 Closed Circle' : '🌐 Public Network'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#CCD6F6] text-sm leading-relaxed mb-6 whitespace-pre-wrap font-sans">
                      {item.content}
                    </p>

                    {/* 📸 SMART MEDIA GALLERY: Now using 'item' to match your loop */}
                    {item.mediaUrls && item.mediaUrls.length > 0 && (
                      <div className="mt-4 mb-6">
                        <div className={`flex gap-3 pb-2 ${item.mediaUrls.length > 1 ? 'overflow-x-auto snap-x' : ''}`}>
                          {item.mediaUrls.map((url, index) => (
                            <div key={index} className="relative shrink-0 snap-center">
                              {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                <video controls className="max-h-80 w-auto rounded-lg border border-white/10">
                                  <source src={url} />
                                </video>
                              ) : (
                                <img 
                                  src={url} 
                                  alt="Archive Media" 
                                  className="max-h-80 w-auto rounded-lg border border-white/10 object-contain" 
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ⭐ & 💬 THE LIVE SOCIAL ENGINE */}
                    <SocialEngine 
                      milestoneId={item.id} 
                      likesCount={likesCount} 
                      hasLiked={hasLiked} 
                      comments={item.comments} 
                    />

                  </div>
                </div>
              );
            })
          )}

          <div className="relative pl-8 md:pl-12 pt-8">
            <div className="absolute w-3 h-3 bg-transparent border-2 border-[#F5F5DC]/30 rounded-full -left-[7px] top-10"></div>
            <div className="text-xs text-[#F5F5DC]/30 uppercase tracking-widest italic">
              Lineage Origin Established
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}