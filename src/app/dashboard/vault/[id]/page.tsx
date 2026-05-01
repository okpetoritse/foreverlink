import { auth, prisma } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

// Next.js 15 requirement: params must be treated as a Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function VaultContentPage({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // Unwrap the parameters
  const resolvedParams = await params;
  const vaultId = resolvedParams.id;

  // Fetch the specific vault securely
  const vault = await prisma.timeVault.findUnique({
    where: { id: vaultId },
  });

  // If it doesn't exist, throw a 404
  if (!vault) return notFound();

  // Security Check 1: Does this user own the vault? 
  // (Later we can expand this to check if they are in the allowed targetGen)
  if (vault.creatorId !== userId) {
    return (
      <main className="min-h-screen bg-[#0A192F] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-red-400 text-2xl font-bold mb-2">ACCESS DENIED</h1>
          <p className="text-white/50">You do not have clearance to view this node.</p>
        </div>
      </main>
    );
  }

  // Security Check 2: The Time Lock
  const now = new Date();
  const isUnlocked = now >= vault.unlockDate;

  // ==========================================
  // STATE A: VAULT IS STILL SEALED
  // ==========================================
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="bg-[#050B14] border border-white/10 rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl relative z-10">
          <svg className="w-16 h-16 text-white/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Vault Sealed</h1>
          <p className="text-sm text-white/50 mb-8">
            This memory is cryptographically locked until <br/>
            <span className="text-[#D4AF37] font-bold mt-2 inline-block">
              {vault.unlockDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </p>
          <Link href="/dashboard/vault" className="inline-block border border-white/20 text-white/70 px-6 py-2 rounded uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">
            Return to Vaults
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // STATE B: VAULT IS UNLOCKED (Content Reveal)
  // ==========================================
  return (
    <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 md:p-10 pt-10 md:pt-16">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
              Seal Broken
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">{vault.title}</h1>
          </div>
          <Link href="/dashboard/vault" className="hidden md:block border border-white/20 text-white/70 px-4 py-2 rounded uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">
            Back
          </Link>
        </div>

        <div className="bg-[#050B14] border border-[#D4AF37]/30 rounded-xl p-8 md:p-12 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
            Original Target Date: {vault.unlockDate.toLocaleDateString()}
          </p>
          
          <div className="prose prose-invert max-w-none text-white/80 leading-relaxed whitespace-pre-wrap font-serif text-lg">
            {vault.content || "No written content was sealed in this vault."}
          </div>

          {vault.mediaUrl && (
            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Attached Artifact</p>
              
              {/* Smart Media Render: Checks if the URL ends in a video format */}
              {vault.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video 
                  controls 
                  className="rounded-lg max-w-full h-auto border border-white/10 w-full shadow-2xl"
                >
                  <source src={vault.mediaUrl} />
                  Your browser does not support the video player.
                </video>
              ) : (
                <img 
                  src={vault.mediaUrl} 
                  alt="Vault Artifact" 
                  className="rounded-lg max-w-full h-auto border border-white/10 shadow-2xl" 
                />
              )}
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}