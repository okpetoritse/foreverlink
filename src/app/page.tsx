import { auth } from "@/auth";
import Link from "next/link";

export default async function HomePage() {
  // 🔐 Check if the user is already logged in
  const session = await auth();

  return (
    // 🎨 HERO BACKGROUND APPLIED HERE: It looks for /hero-bg.jpg in your public folder
    <main className="relative min-h-screen bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-fixed font-sans overflow-hidden">
      
      {/* 🌑 DARK OVERLAY: Keeps the text highly readable against any background image */}
      <div className="absolute inset-0 bg-[#0A192F]/60 z-0"></div>

      {/* 🧭 PUBLIC NAVIGATION BAR */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-serif font-bold text-[#D4AF37] tracking-wider">
          ForeverLink.
        </h1>
        <nav>
          {/* 🧠 Smart Routing based on User Session */}
          {session ? (
            <Link 
              href="/dashboard" 
              className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* 🖼️ MAIN HERO CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 md:px-12 min-h-[calc(100vh-100px)] gap-16 pb-20">
        
        {/* LEFT COLUMN: The Pitch */}
        <div className="flex-1 text-center lg:text-left mt-10 lg:mt-0">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#D4AF37] mb-6 drop-shadow-2xl">
            ForeverLink
          </h2>
          <p className="text-lg md:text-2xl text-[#F5F5DC]/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10 font-light">
            The digital legacy engine. Preserve your achievements, stories, and time vaults for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            
            {/* 🧠 Smart Call-to-Action based on User Session */}
            {session ? (
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105"
              >
                Return to Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105"
              >
                Begin Your Legacy
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The 4-Corner Family Grid */}
        <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none">
          <div className="grid grid-cols-2 gap-4 md:gap-6 p-4">
            
            {/* Image 1 (Top Left) */}
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 relative">
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" 
                alt="Family Bonding" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Image 2 (Top Right - Pushed down slightly) */}
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] transform translate-y-8 rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 relative">
              <img 
                src="https://images.unsplash.com/photo-1581985673473-0784a7a44e39?q=80&w=600&auto=format&fit=crop" 
                alt="Generations" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Image 3 (Bottom Left - Pulled up slightly) */}
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] transform -translate-y-4 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 relative">
              <img 
  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop" 
  alt="Legacy" 
  className="w-full h-full object-cover" 
/>
            </div>

            {/* Image 4 (Bottom Right) */}
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transform translate-y-4 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 relative">
              <img 
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop" 
                alt="Future" 
                className="w-full h-full object-cover" 
              />
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}