import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import AcceptButton from "./AcceptButton";

// Next.js standard way of reading URL parameters (e.g., ?token=123)
export default async function InviteLandingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params.token;

  // 1. If there's no token in the URL, block access
  if (!token) {
    return (
      <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] flex items-center justify-center font-mono">
        <div className="text-center">
          <h1 className="text-red-500 text-2xl font-bold uppercase tracking-widest mb-2">Invalid Access</h1>
          <p className="text-[#8892B0]">No cryptographic token detected.</p>
        </div>
      </main>
    );
  }

  // 2. Look up the token in the database
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { inviter: true } // Pull the name of the person who sent it
  });

  // 3. Security Checks (Expired, Already Claimed, or Fake)
  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    return (
      <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] flex items-center justify-center font-mono">
        <div className="text-center p-8 bg-[#0A192F] border border-white/10 rounded-xl shadow-2xl">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h1 className="text-white text-xl font-bold uppercase tracking-widest mb-2">Link Expired or Invalid</h1>
          <p className="text-[#8892B0] text-sm max-w-md mx-auto">This lineage bridge token has expired, already been claimed, or does not exist in the system.</p>
        </div>
      </main>
    );
  }

  // 4. Force them to log in before they can accept
  const session = await auth();
  if (!session?.user) {
    // If they aren't logged in, send them to login, but remember the token!
    redirect(`/login?callbackUrl=/invite?token=${token}`);
  }

  // 5. The Beautiful "Accept" Interface
  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] flex items-center justify-center font-mono relative overflow-hidden p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-[#0A192F]/80 border border-[#D4AF37]/30 rounded-2xl p-8 md:p-10 shadow-2xl text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#112240] border-2 border-[#D4AF37] flex items-center justify-center shadow-inner overflow-hidden">
             {invite.inviter.image ? (
                <img src={invite.inviter.image} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Network Invitation</h1>
        <p className="text-[#8892B0] mb-8 leading-relaxed">
          <strong className="text-[#D4AF37]">{invite.inviter.name || "A ForeverLink member"}</strong> has invited you to join their secure lineage network as a <strong className="text-white uppercase">{invite.relationship}</strong>.
        </p>

        <div className="bg-[#050B14] border border-white/5 rounded-lg p-4 mb-8 text-left">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Security Clearance: {invite.clearance}</h3>
          </div>
          <p className="text-[10px] text-[#8892B0]">
            Accepting this invitation will permanently link your accounts and grant you access to their designated Time Vaults and Memories.
          </p>
        </div>

        {/* 🚀 THE CLIENT BUTTON WE JUST BUILT */}
        <AcceptButton token={token} />
        
      </div>
    </main>
  );
}