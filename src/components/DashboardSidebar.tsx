"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SidebarProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export default function DashboardSidebar({ user, onSignOut }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 🚀 Automatically close the mobile menu when a user clicks a link
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { name: "Overview", href: "/dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path> },
    { name: "Family Tree", href: "/dashboard/tree", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path> },
    { name: "Network & Invites", href: "/dashboard/network", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path> },
    { name: "Achievements", href: "/dashboard/timeline", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path> },
    { name: "Time Vaults", href: "/dashboard/vault", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> },
    { name: "Professional Directory", href: "/dashboard/directory", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> },
    { name: "About ForeverLink", href: "/dashboard/about", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> },
    { name: "Settings", href: "/dashboard/settings", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> },
  ];

  return (
    <>
      {/* 📱 MOBILE TOP HEADER */}
      <header className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A192F]/95 backdrop-blur-xl z-40 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="p-1 -ml-1 text-[#D4AF37] hover:bg-white/5 rounded-md transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <h2 className="text-xl font-serif font-bold text-[#D4AF37]">ForeverLink.</h2>
        </div>
        <img 
          src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-[#D4AF37] object-cover"
        />
      </header>

      {/* 🌑 MOBILE OVERLAY (Dims the screen when menu is open) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 💻 UNIFIED SIDEBAR (Slide-in on mobile, permanent on desktop) */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-[#0A192F] flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-serif font-bold text-[#D4AF37] tracking-wide">ForeverLink.</h2>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-[#F5F5DC]/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive 
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" 
                      : "text-[#F5F5DC]/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {link.icon}
                  </svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
          <div className="flex items-center gap-3 mb-5">
            <img 
              src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
              alt="Profile" 
              className="w-11 h-11 rounded-full border-2 border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)] object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-[#D4AF37] truncate">{user.email}</p>
            </div>
          </div>
          
          <form action={onSignOut}>
            <button className="w-full text-left text-xs text-[#F5F5DC]/50 hover:text-white transition-colors flex items-center gap-2 px-1">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Secure Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}