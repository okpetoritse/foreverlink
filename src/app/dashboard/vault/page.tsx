import { auth, prisma } from "@/auth";
import SealVaultModal from "./SealVaultModal";
import Link from "next/link";

export default async function TimeVaultPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // We fetch the real vaults from the database
  const vaults = await prisma.timeVault.findMany({
    where: { creatorId: userId },
    orderBy: { unlockDate: 'asc' }
  });

  return (
    <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              Quantum Security Active
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">The Time Vault</h1>
            <p className="text-[#F5F5DC]/70 text-sm md:text-base max-w-xl leading-relaxed">
              Cryptographically seal your deepest secrets, wealth maps, and final messages. These vaults cannot be opened by anyone—not even you—until the countdown reaches zero.
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <SealVaultModal />
          </div>
        </div>

        {/* The Vault Grid */}
        {vaults.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center py-10">
              <h3 className="text-2xl font-serif text-white mb-2">No Active Vaults</h3>
              <p className="text-[#F5F5DC]/50 text-sm">Preview the security architecture below, then seal your first message.</p>
            </div>

            {/* DEMO VAULT */}
            <div className="relative max-w-sm mx-auto bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-500 shadow-2xl">
              <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-6 border-b border-white/10 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                   <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase">Time-Locked</span>
                 </div>
                 <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md">ID: DEMO-01</span>
              </div>

              <div className="p-8 text-center relative">
                <div className="w-24 h-24 mx-auto bg-[#0A192F] border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-[#D4AF37] animate-spin" style={{ animationDuration: '3s' }}></div>
                  <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Demo Vault</h2>
                <p className="text-[10px] text-center text-[#F5F5DC]/40 uppercase tracking-widest">Unlocks: Jan 1st, 2050</p>
              </div>
            </div>
          </div>
        ) : (
          /* REAL VAULTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vaults.map((vault) => {
              const isUnlocked = new Date() >= vault.unlockDate;

              return (
                <div key={vault.id} className={`relative bg-[#0A192F]/80 backdrop-blur-xl border ${isUnlocked ? 'border-emerald-500/30' : 'border-white/10'} rounded-[2rem] overflow-hidden shadow-2xl group hover:-translate-y-1 transition-transform duration-300`}>
                  
                  {/* Top Bar */}
                  <div className={`p-6 border-b border-white/10 flex justify-between items-center ${isUnlocked ? 'bg-gradient-to-r from-emerald-500/10 to-transparent' : 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent'}`}>
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <>
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Unlocked</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                          <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase">Time-Locked</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30 uppercase">ID: {vault.id.slice(-6)}</span>
                  </div>

                  <div className="p-8 text-center relative">
                    {/* Visual Icon */}
                    <div className={`w-20 h-20 mx-auto bg-[#0A192F] border-2 ${isUnlocked ? 'border-emerald-500/30' : 'border-[#D4AF37]/30'} rounded-full flex items-center justify-center mb-6 relative`}>
                      {!isUnlocked && (
                        <div className="absolute inset-0 rounded-full border-t-2 border-[#D4AF37] animate-spin opacity-50" style={{ animationDuration: '4s' }}></div>
                      )}
                      <svg className={`w-8 h-8 ${isUnlocked ? 'text-emerald-400' : 'text-[#D4AF37]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isUnlocked 
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        }
                      </svg>
                    </div>

                    <h2 className="text-xl font-serif text-white mb-6 truncate px-2">{vault.title}</h2>

                    {/* Unlock Date Display */}
                    <div className={`bg-black/30 rounded-lg p-3 border ${isUnlocked ? 'border-emerald-500/20' : 'border-white/5'}`}>
                      <p className="text-[10px] text-[#F5F5DC]/50 uppercase tracking-widest mb-1">Target Date</p>
                      <p className={`font-mono text-sm ${isUnlocked ? 'text-emerald-400' : 'text-[#D4AF37]'} font-medium`}>
                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(vault.unlockDate)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom Action Button (Only visible if unlocked) */}
                  {isUnlocked && (
                    <div className="p-4 border-t border-emerald-500/20 bg-emerald-500/5">
                      <Link 
  href={`/dashboard/vault/${vault.id}`} 
  className="block w-full text-center bg-teal-900/20 text-teal-400 font-bold py-3 rounded-lg border border-teal-500/30 hover:bg-teal-500 hover:text-[#0A192F] transition-colors"
>
  View Contents
</Link>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}