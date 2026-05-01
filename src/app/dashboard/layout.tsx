import { auth, signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0A192F] text-[#F5F5DC] overflow-hidden">
      
      {/* 📱 MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A192F]/90 backdrop-blur-xl z-20">
        <h2 className="text-xl font-serif font-bold text-[#D4AF37]">ForeverLink.</h2>
        <div className="flex items-center gap-4">
          <img 
            src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-[#D4AF37] object-cover"
          />
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="text-xs font-medium text-[#F5F5DC]/70 hover:text-white transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* 💻 DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-[#0A192F]/80 backdrop-blur-xl flex-col justify-between z-20">
        <div className="p-6">
          <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-10 tracking-wide">ForeverLink.</h2>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Overview
            </Link>
            
            {/* 🌳 RESTORED: The Visual Family Tree */}
            <Link href="/dashboard/tree" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Family Tree
            </Link>

           

            {/* 🔗 NEW: The Network Invite Engine */}
            <Link href="/dashboard/network" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Network & Invites
            </Link>

            {/* 🏆 FIXED: The Unified Timeline Archive */}
            <Link href="/dashboard/timeline" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              Achievements
            </Link>

            <Link href="/dashboard/vault" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Time Vaults
            </Link>

            <Link href="/dashboard/directory" className="flex items-center gap-3 px-6 py-3 text-[#F5F5DC]/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors font-medium">
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
  Professional Directory
</Link>


           {/* ⚙️ Profile Settings Link */}
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-5">
            <img 
              src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} 
              alt="Profile" 
              className="w-11 h-11 rounded-full border-2 border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)] object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
              <p className="text-xs text-[#D4AF37] truncate">{session.user.email}</p>
            </div>
          </div>
          
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="w-full text-left text-xs text-[#F5F5DC]/50 hover:text-white transition-colors flex items-center gap-2 px-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Secure Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* 🖼️ MAIN CANVAS */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-24 md:pb-0">
        {children}
      </main>

      {/* 📱 MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0A192F]/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around pb-6 pt-3 px-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#F5F5DC]/70 hover:text-[#D4AF37] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/dashboard/tree" className="flex flex-col items-center gap-1 text-[#F5F5DC]/70 hover:text-[#D4AF37] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          <span className="text-[10px] font-medium">Tree</span>
        </Link>
        <Link href="/dashboard/network" className="flex flex-col items-center gap-1 text-[#F5F5DC]/70 hover:text-[#D4AF37] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          <span className="text-[10px] font-medium">Network</span>
        </Link>
        <Link href="/dashboard/timeline" className="flex flex-col items-center gap-1 text-[#F5F5DC]/70 hover:text-[#D4AF37] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          <span className="text-[10px] font-medium">Awards</span>
        </Link>
      </nav>

    </div>
  );
}