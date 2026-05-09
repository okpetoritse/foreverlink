import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Added for optimized images

export default async function FamilyTreePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // 1. 🚀 FETCH THE LIVE GRAPH DATA (Now including ID and Image)
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, image: true, email: true }
  });

  const connections = await prisma.familyConnection.findMany({
    where: { userId: userId },
    include: {
      connectedUser: { select: { id: true, name: true, image: true, email: true } }
    }
  });

  // 2. 🧠 THE SORTING ENGINE
  const parents = connections.filter(c => c.relationship === "PARENT");
  const spouses = connections.filter(c => c.relationship === "SPOUSE");
  const siblings = connections.filter(c => c.relationship === "SIBLING");
  const children = connections.filter(c => c.relationship === "CHILD");

  // 🎨 UPGRADED: INTERACTIVE PERSON NODE
  const PersonNode = ({ id, name, role, image, isYou = false }: { id: string, name: string, role: string, image?: string | null, isYou?: boolean }) => (
    // We wrap the whole card in a Link to route to their Legacy Profile
    <Link href={`/dashboard/legacy/${id}`} className={`flex flex-col items-center p-5 rounded-2xl border ${isYou ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/10 bg-[#0A192F] hover:bg-white/5'} w-40 sm:w-48 relative z-10 transition-all hover:scale-105 hover:border-[#64FFDA]/50 cursor-pointer`}>
      
      {/* Profile Image or Initial Fallback */}
      {image ? (
        <img src={image} alt={name} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 object-cover border-2 ${isYou ? 'border-[#D4AF37]' : 'border-[#64FFDA]'}`} />
      ) : (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 flex items-center justify-center font-bold text-2xl border-2 ${isYou ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#64FFDA] text-[#64FFDA]'}`}>
          {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      
      {/* Full Name (Removed truncate, added break-words) */}
      <span className="text-white text-sm sm:text-base font-bold text-center break-words w-full leading-tight">{name || "Pending..."}</span>
      
      {/* Role */}
      <span className={`text-[10px] sm:text-xs uppercase tracking-widest mt-2 ${isYou ? 'text-[#D4AF37]' : 'text-[#8892B0]'}`}>{role}</span>
    </Link>
  );

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-[#D4AF37]/30 pb-4 mb-16">
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37] tracking-widest uppercase mb-2">The Family Tree</h1>
            <p className="text-xs text-[#8892B0] uppercase">Mapping your lineage autonomously across generations.</p>
          </div>
          <Link href="/dashboard/network" className="bg-[#D4AF37] text-[#050B14] px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            + Add Member
          </Link>
        </div>

        {/* 🌳 THE DYNAMIC CANVAS */}
        <div className="relative w-full overflow-x-auto pb-32 pt-10 flex flex-col items-center min-h-[600px] border border-white/5 rounded-2xl bg-[#0A192F]/30">
          
          {/* TIER 1: PARENTS (Above) */}
          {parents.length > 0 && (
            <div className="flex justify-center gap-12 mb-16 relative">
              {parents.map((p) => (
                <PersonNode key={p.id} id={p.connectedUser.id} name={p.connectedUser.name || "Unknown"} image={p.connectedUser.image} role="Parent" />
              ))}
              <div className="absolute -bottom-16 left-1/2 w-px h-16 bg-white/20"></div>
            </div>
          )}

          {/* TIER 2: YOU, SPOUSES, & SIBLINGS (Middle) */}
          <div className="flex justify-center items-center gap-8 relative">
            
            {/* Siblings */}
            {siblings.length > 0 && (
              <div className="flex gap-4 mr-8 border-r border-white/10 pr-8">
                {siblings.map((s) => (
                  <PersonNode key={s.id} id={s.connectedUser.id} name={s.connectedUser.name || "Unknown"} image={s.connectedUser.image} role="Sibling" />
                ))}
              </div>
            )}

            {/* YOU */}
            {currentUser && (
              <div className="relative">
                <PersonNode id={currentUser.id} name={currentUser.name || "You"} image={currentUser.image} role="STEWARD" isYou={true} />
                {children.length > 0 && <div className="absolute -bottom-16 left-1/2 w-px h-16 bg-[#D4AF37]/50"></div>}
              </div>
            )}

            {/* Spouses */}
            {spouses.length > 0 && (
              <div className="flex gap-8 items-center ml-4">
                <span className="text-pink-500 text-xl animate-pulse">♥</span>
                {spouses.map((s) => (
                  <PersonNode key={s.id} id={s.connectedUser.id} name={s.connectedUser.name || "Unknown"} image={s.connectedUser.image} role="Spouse" />
                ))}
              </div>
            )}
          </div>

          {/* TIER 3: CHILDREN (Below) */}
          {children.length > 0 && (
            <div className="flex justify-center gap-8 mt-16 relative pt-4">
              {children.length > 1 && (
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-[#D4AF37]/50"></div>
              )}
              
              {children.map((c) => (
                <div key={c.id} className="relative pt-4">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-[#D4AF37]/50"></div>
                  <PersonNode id={c.connectedUser.id} name={c.connectedUser.name || "Unknown"} image={c.connectedUser.image} role="Descendant" />
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
}