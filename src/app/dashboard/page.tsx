import Link from "next/link";
import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardOverview() {
  const session = await auth();
  const userId = session?.user?.id;
  const firstName = session?.user?.name?.split(" ")[0] || "Steward";

  if (!userId) redirect("/login");

  // 🚀 LIVE METRICS ENGINE: Fetching real counts from the database
  const networkCount = await prisma.connection.count({
    where: { ownerId: userId }
  });

  const vaultCount = await prisma.timeVault.count({
    where: { creatorId: userId }
  });

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId }
  });

  return (
    <div className="p-8 md:p-12 min-h-screen bg-[#0A192F] text-[#F5F5DC] font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-4">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[#8892B0] text-lg">
            Your family's legacy is secure. What would you like to add today?
          </p>
        </div>

        {/* 📊 LIVE SYSTEM METRICS (The Pro Upgrade) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#112240] border border-[#233554] p-5 rounded-xl shadow-lg">
            <p className="text-xs text-[#8892B0] uppercase tracking-widest font-bold mb-1">Network Bridges</p>
            <p className="text-3xl font-bold text-white">{networkCount}</p>
          </div>
          <div className="bg-[#112240] border border-[#233554] p-5 rounded-xl shadow-lg">
            <p className="text-xs text-[#8892B0] uppercase tracking-widest font-bold mb-1">Active Vaults</p>
            <p className="text-3xl font-bold text-white">{vaultCount}</p>
          </div>
          <div className="bg-[#112240] border border-[#233554] p-5 rounded-xl shadow-lg">
            <p className="text-xs text-[#8892B0] uppercase tracking-widest font-bold mb-1">Auth Level</p>
            <p className="text-xl font-bold text-teal-400 mt-1">ALPHA</p>
          </div>
          <div className="bg-[#112240] border border-[#233554] p-5 rounded-xl shadow-lg">
            <p className="text-xs text-[#8892B0] uppercase tracking-widest font-bold mb-1">Partner Status</p>
            <p className={`text-sm font-bold mt-2 ${vendorProfile?.isVerified ? "text-[#D4AF37]" : "text-[#8892B0]"}`}>
              {vendorProfile?.isVerified ? "VERIFIED VENDOR" : "STANDARD STEWARD"}
            </p>
          </div>
        </div>

        {/* Dashboard Cards Grid (Your exact links) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 🌳 Routes to visual Family Tree */}
          <Link href="/dashboard/tree" className="group block p-6 md:p-8 bg-[#112240] border border-white/5 rounded-2xl hover:border-[#D4AF37]/50 hover:bg-[#112240]/80 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-3">The Family Tree</h2>
            <p className="text-sm text-[#8892B0] leading-relaxed">
              Map your lineage, view generations, and visualize the branches of your history.
            </p>
          </Link>

          {/* Time Vaults */}
          <Link href="/dashboard/vault" className="group block p-6 md:p-8 bg-[#112240] border border-white/5 rounded-2xl hover:border-[#D4AF37]/50 hover:bg-[#112240]/80 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="w-12 h-12 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-3">Time Vaults</h2>
            <p className="text-sm text-[#8892B0] leading-relaxed">
              Seal messages, videos, and documents to be unlocked by future generations on a specific date.
            </p>
          </Link>

          {/* Master Timeline Gallery */}
          <Link href="/dashboard/timeline" className="group block p-6 md:p-8 bg-[#112240] border border-white/5 rounded-2xl hover:border-[#D4AF37]/50 hover:bg-[#112240]/80 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="w-12 h-12 bg-[#10B981]/10 text-[#10B981] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-3">Achievement Gallery</h2>
            <p className="text-sm text-[#8892B0] leading-relaxed">
              Share present-day successes, awards, and milestones for your descendants to react to.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}