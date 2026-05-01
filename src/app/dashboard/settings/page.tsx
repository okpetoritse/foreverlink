import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/actions/settings";

// 🚀 1. WE IMPORT THE BUTTON HERE AT THE TOP
import FamilyUpgradeWrapper from "@/components/FamilyUpgradeWrapper";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // Fetch the definitive user record from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-10 pt-10 md:pt-16 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Module Header */}
        <div className="mb-10 border-b border-[#D4AF37]/20 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#D4AF37] mb-2">
            Profile Settings
          </h1>
          <p className="text-[#8892B0] text-sm">
            Manage your personal information, security, and presence on ForeverLink.
          </p>
        </div>

        {/* The Action Form */}
        <form action={updateProfile} className="space-y-8">
          
          {/* SEC 1: Public Identity */}
          <div className="bg-[#0A192F] border border-[#233554] rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Public Identity
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-2 border-[#D4AF37] object-cover shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-[#112240]"
                />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8892B0] uppercase tracking-wider mb-2">Display Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={user?.name || ""} 
                    className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8892B0] uppercase tracking-wider mb-2">Avatar Media URL</label>
                  <input 
                    type="url" 
                    name="image" 
                    placeholder="Paste a direct image link here..."
                    defaultValue={user?.image || ""} 
                    className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEC 2: Account Information & BILLING */}
          <div className="bg-[#0A192F] border border-[#233554] rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Account Information & Billing
            </h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-xs font-bold text-[#8892B0] uppercase tracking-wider mb-2">Primary Email Address</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue={user?.email || ""} 
                  className="w-full bg-[#112240]/50 border border-[#233554]/50 rounded-lg px-4 py-3 text-[#8892B0] cursor-not-allowed"
                />
              </div>

              {/* 🚀 2. WE PLACE THE BUTTON HERE */}
              <div className="pt-6 border-t border-[#233554]">
                <label className="block text-xs font-bold text-[#8892B0] uppercase tracking-wider mb-2">Storage Plan</label>
                
                {/* Check if they are already Premium */}
                {user?.planTier === "VAULT_PREMIUM" ? (
                  <div className="bg-teal-400/10 border border-teal-400 text-teal-400 px-4 py-3 rounded-lg text-sm font-bold tracking-widest uppercase">
                    Premium Vault Access Unlocked
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[#8892B0]">
                      You are currently on the Standard plan. Upgrade to unlock expanded Time Vault storage for generations.
                    </p>
                    <FamilyUpgradeWrapper userId={userId} email={user?.email || ""} />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Execution Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Update Profile
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}