import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import VaultTimer from "@/components/VaultTimer";

export default async function LegacyProfilePage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const targetId = params.userId;

  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) redirect("/login");

  // 1. Fetch the target user's identity
  const targetUser = await prisma.user.findUnique({
    where: { id: targetId },
    select: { name: true, image: true, email: true }
  });

  if (!targetUser) {
    return <div className="text-white p-8">Family member not found in the vault.</div>;
  }

  // 2. 🛡️ PLACE THE VAULT FETCH HERE (Right after user fetch)
  const nextVault = await prisma.timeVault.findFirst({
    where: { 
      creatorId: targetId,
      unlockDate: { gt: new Date() } 
    },
    orderBy: { unlockDate: 'asc' }
  });

  // 3. Fetch achievements as usual
  const achievements = await prisma.achievement.findMany({
    where: { userId: targetId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link href="/dashboard/tree" className="text-[#8892B0] hover:text-[#D4AF37] text-sm uppercase tracking-widest mb-6 inline-block transition-colors">
            ← Return to Family Tree
          </Link>
          
          <div className="flex items-center gap-6 border-b border-[#D4AF37]/30 pb-6 mt-4">
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
              <p className="text-xs text-[#8892B0] uppercase tracking-wider">Unified History & Achievements</p>
            </div>
          </div>
        </div>

        {/* 4. 🛡️ PLACE THE VISUAL TIMER HERE (Above the feed) */}
        {nextVault && (
          <div className="mb-12">
            <h2 className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-6 text-center italic">
              — Temporal Lock in Effect —
            </h2>
            <VaultTimer targetDate={nextVault.unlockDate.toISOString()} />
          </div>
        )}

        {/* 5. The Timeline Feed */}
        <div className="space-y-8 mt-8">
          {achievements.length === 0 ? (
            <div className="text-center p-12 border border-white/5 rounded-2xl bg-[#0A192F]/30">
              <p className="text-[#8892B0] uppercase tracking-widest text-sm">No archive records found.</p>
            </div>
          ) : (
            achievements.map((post) => (
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
                  {post.description}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}