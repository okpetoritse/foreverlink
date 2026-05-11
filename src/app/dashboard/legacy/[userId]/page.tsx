import { auth, prisma } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import VaultTimer from "@/components/VaultTimer";

export default async function LegacyProfilePage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const targetId = params.userId;

  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) redirect("/login");

  // Prevent users from viewing their own legacy page this way
  if (currentUserId === targetId) {
    redirect("/dashboard/profile");
  }

  // ==========================================
  // 1. 🛡️ THE BLOODLINE PROTOCOL (Security)
  // ==========================================
  // ==========================================
  // 1. 🛡️ THE BLOODLINE PROTOCOL (Security)
  // ==========================================
  let clearanceBadge = "OWNER";

  // If you are looking at someone else's archive, verify the family connection
  if (currentUserId !== targetId) {
    const familyConnection = await prisma.familyConnection.findUnique({
      where: {
        userId_connectedUserId: {
          userId: currentUserId,
          connectedUserId: targetId,
        }
      }
    });

    // If no lineage connection exists, kick the intruder out
    if (!familyConnection) notFound();
    
    // If connection exists, set the badge to their exact relationship
    clearanceBadge = familyConnection.relationship;
  }

  // ==========================================
  // 2. FETCH IDENTITY & DATA
  // ==========================================
  const targetUser = await prisma.user.findUnique({
    where: { id: targetId },
    select: { name: true, image: true, email: true, birthYear: true, isDeceased: true }
  });

  if (!targetUser) notFound();

  // Fetch ALL vaults and split by date
  const allVaults = await prisma.timeVault.findMany({
    where: { creatorId: targetId },
    orderBy: { unlockDate: 'asc' }
  });

  const now = new Date();
  const unlockedVaults = allVaults.filter(vault => vault.unlockDate <= now);
  const lockedVaults = allVaults.filter(vault => vault.unlockDate > now);

  // 🚀 REPLACED ACHIEVEMENTS WITH YOUR ADVANCED MILESTONES
  const milestones = await prisma.milestone.findMany({
    where: { 
      authorId: targetId,
      clearance: "EXTENDED" // Only show public milestones on the profile
    },
    orderBy: { createdAt: 'desc' } 
  });

  // ==========================================
  // 3. THE INTERFACE
  // ==========================================
  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          <Link href="/dashboard/tree" className="text-[#8892B0] hover:text-[#D4AF37] text-sm uppercase tracking-widest mb-6 inline-block transition-colors">
            ← Return to Lineage Tree
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#D4AF37]/30 pb-6 mt-4">
            <div className="flex items-center gap-6">
              {targetUser.image ? (
                <img src={targetUser.image} alt={targetUser.name || "User"} className="w-20 h-20 rounded-full border-2 border-[#D4AF37] object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl border-2 border-[#D4AF37] text-[#D4AF37] bg-[#0A192F]">
                  {targetUser.name ? targetUser.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-[#D4AF37] tracking-widest uppercase mb-1">
                  {targetUser.name}'s Archive
                </h1>
                <p className="text-xs text-[#8892B0] uppercase tracking-wider">
                  {targetUser.birthYear ? `Born ${targetUser.birthYear} • ` : ""}
                  {targetUser.isDeceased ? "Passed to Eternity" : "Living Record"}
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Clearance: {clearanceBadge}
            </div>
          </div>
        </div>

        {/* UNLOCKED VAULTS (Already Opened) */}
        {unlockedVaults.length > 0 && (
          <div className="mb-12 space-y-6">
            <h2 className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] border-b border-white/5 pb-2">
              Unlocked Memories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlockedVaults.map(vault => (
                <Link key={vault.id} href={`/dashboard/vault/${vault.id}`} className="block bg-[#0A192F]/50 border border-emerald-500/30 rounded-xl p-6 hover:bg-[#0A192F] transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold tracking-wide">{vault.title}</h3>
                    <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                  <p className="text-xs text-emerald-400/70 uppercase tracking-widest">
                    Opened: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(vault.unlockDate)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* LOCKED VAULTS (Ticking Down) */}
        {lockedVaults.length > 0 && (
          <div className="mb-12 space-y-6">
            <h2 className="text-[#8892B0] text-sm uppercase tracking-[0.3em] border-b border-white/5 pb-2">
              Sealed Time Vaults
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lockedVaults.map(vault => (
                <div key={vault.id} className="bg-[#0A192F]/30 border border-white/10 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-white/80 font-serif mb-1">{vault.title}</h3>
                    <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Target: {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(vault.unlockDate)}</p>
                  </div>
                  {/* Using your compact timer for the grid */}
                  <VaultTimer targetDate={vault.unlockDate.toISOString()} compact={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Timeline Feed (Now using Milestones) */}
        <div className="space-y-6">
          <h2 className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] border-b border-white/5 pb-2">
            Historical Feed
          </h2>
          {milestones.length === 0 ? (
            <div className="text-center p-12 border border-white/5 rounded-xl bg-[#0A192F]/30">
              <p className="text-[#8892B0] uppercase tracking-widest text-sm">No archive records found.</p>
            </div>
          ) : (
            milestones.map((post) => (
              <div key={post.id} className="bg-[#0A192F] border border-white/5 rounded-xl p-6 relative shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{post.title}</h3>
                    <p className="text-[#D4AF37]/70 text-xs mt-1 uppercase tracking-widest">
                       {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="p-6 text-[#8892B0] text-sm leading-relaxed border border-white/10 rounded-lg">
                  {post.content}
                </div>
                {/* Optional: If you want to show their images here too, we can easily add your media array logic! */}
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
} 