import { auth, prisma } from "@/auth";
import AddRelativeModal from "./AddRelativeModal";

export default async function TreePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const familyLinks = await prisma.familyLink.findMany({
    where: {
      OR: [{ parentId: userId }, { childId: userId }]
    }
  });

  const parentIds = familyLinks.filter(l => l.childId === userId && l.relationship === "BIOLOGICAL").map(l => l.parentId);
  const childIds = familyLinks.filter(l => l.parentId === userId && l.relationship === "BIOLOGICAL").map(l => l.childId);
  const spouseIds = familyLinks.filter(l => l.relationship === "SPOUSE").map(l => l.parentId === userId ? l.childId : l.parentId);
  const siblingIds = familyLinks.filter(l => l.relationship === "SIBLING").map(l => l.parentId === userId ? l.childId : l.parentId);

  const parents = await prisma.user.findMany({ where: { id: { in: parentIds } } });
  const children = await prisma.user.findMany({ where: { id: { in: childIds } } });
  const spouses = await prisma.user.findMany({ where: { id: { in: spouseIds } } });
  const siblings = await prisma.user.findMany({ where: { id: { in: siblingIds } } });

  return (
    <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 md:p-8 pt-8 relative flex flex-col">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37] mb-2">The Family Tree</h1>
            <p className="text-[#F5F5DC]/70 text-xs md:text-sm">Mapping your lineage across generations.</p>
          </div>
          <AddRelativeModal />
        </div>

        {/* 🌳 THE NODE GRAPH CANVAS */}
        <div className="relative bg-[#0A192F]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 min-h-[600px] flex flex-col items-center overflow-x-auto">
          
          {parents.length === 0 && children.length === 0 && spouses.length === 0 && siblings.length === 0 ? (
             <div className="m-auto text-center">
               <svg className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4"></path></svg>
               <p className="text-[#F5F5DC]/60 italic">Your legacy canvas is empty.</p>
             </div>
          ) : (
            <div className="flex flex-col items-center w-full min-w-max pb-20 mt-10">
              
              {/* TIER 1: ANCESTORS (Above) */}
              <div className="flex justify-center gap-16 mb-16 relative">
                {parents.map(p => (
                  <div key={p.id} className="relative flex flex-col items-center">
                    {/* Line dropping DOWN to you */}
                    <div className="absolute top-full left-1/2 w-px h-16 bg-[#D4AF37]/40 -translate-x-1/2 z-0"></div>
                    
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-2 z-10">
                      <span className="text-[#D4AF37] font-serif">{p.name?.charAt(0)}</span>
                    </div>
                    <p className="text-xs font-bold">{p.name}</p>
                  </div>
                ))}
              </div>

              {/* TIER 2: PEER GENERATION (Siblings + You + Spouse) */}
              <div className="flex items-start justify-center gap-12 relative z-10">
                
                {/* SIBLINGS SECTION */}
                {siblings.length > 0 && (
                  <div className="flex gap-6 border-r border-white/10 pr-10">
                    {/* Fixed the missing .map loop here! */}
                    {siblings.map(s => (
                      <div key={s.id} className="group relative flex flex-col items-center">
                        <button className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-[#0A192F] p-1 rounded-full transition-all z-20">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </button>

                        <div className="w-14 h-14 bg-white/5 border border-blue-400/20 rounded-full flex items-center justify-center mb-2 group-hover:border-blue-400 transition-colors">
                          <span className="text-blue-400 text-xs font-bold">{s.name?.charAt(0)}</span>
                        </div>
                        <p className="text-xs font-medium">{s.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* THE "MARRIAGE" UNIT (You + Spouses) */}
                <div className="relative flex items-center gap-6 bg-[#D4AF37]/5 p-6 rounded-[2.5rem] border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                  
                  {/* Line dropping DOWN to children */}
                  {children.length > 0 && (
                    <div className="absolute top-full left-1/2 w-px h-10 bg-[#D4AF37]/40 -translate-x-1/2 z-0"></div>
                  )}

                  {/* YOU */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-[#0A192F]">
                      <span className="text-[#D4AF37] font-bold text-xl">You</span>
                    </div>
                    <p className="text-[10px] mt-2 font-bold text-[#D4AF37] uppercase tracking-widest">Steward</p>
                  </div>

                  {spouses.length > 0 && <div className="text-2xl animate-pulse">❤️</div>}

                  {spouses.map(sp => (
                    <div key={sp.id} className="flex flex-col items-center">
                      <div className="w-20 h-20 border-2 border-pink-500/40 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.15)] bg-[#0A192F]">
                        <span className="text-pink-400 font-bold text-xl">{sp.name?.charAt(0)}</span>
                      </div>
                      <p className="text-xs mt-2 font-bold text-white">{sp.name}</p>
                      <p className="text-[10px] text-pink-400/60 uppercase">Spouse</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIER 3: DESCENDANTS (Below) */}
              {children.length > 0 && (
                <div className="flex justify-center gap-16 relative pt-10">
                  
                  {/* Horizontal Bar connecting siblings */}
                  {children.length > 1 && (
                    <div className="absolute top-0 left-1/2 w-[calc(100%-6rem)] h-px bg-[#D4AF37]/40 -translate-x-1/2 z-0"></div>
                  )}

                  {children.map(c => (
                    <div key={c.id} className="relative flex flex-col items-center z-10">
                      {/* Vertical line going UP to horizontal bar */}
                      <div className="absolute bottom-full left-1/2 w-px h-10 bg-[#D4AF37]/40 -translate-x-1/2 z-0"></div>
                      
                      <div className="w-16 h-16 bg-[#0A192F] border border-emerald-500/30 rounded-full flex items-center justify-center mb-2">
                         <span className="text-emerald-400 font-serif">{c.name?.charAt(0)}</span>
                      </div>
                      <p className="text-xs font-bold text-white">{c.name}</p>
                      <p className="text-[10px] text-emerald-500/60 uppercase tracking-tighter">Next Gen</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </main>
  );
}