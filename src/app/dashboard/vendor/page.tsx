import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import VendorForm from "./VendorForm";
import Link from "next/link";

export default async function VendorDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // Fetch their profile securely
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: userId },
    include: {
      user: {
        include: { subscription: true }
      }
    }
  });

  // If they aren't verified, show an upsell block instead of the form
  if (!vendor || !vendor.isVerified) {
    return (
      <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 pt-16 flex items-center justify-center font-mono relative overflow-hidden">
        {/* Premium Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-lg relative z-10 bg-[#0A192F]/80 p-12 rounded-2xl border border-[#D4AF37]/30 shadow-2xl">
          <svg className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4 tracking-widest uppercase">Partner Hub Locked</h1>
          <p className="text-[#8892B0] mb-8 text-sm leading-relaxed">You must be a Verified Professional to access the vendor dashboard and customize your public directory storefront.</p>
          <Link href="/dashboard/directory" className="inline-block bg-[#D4AF37] text-black px-8 py-4 rounded text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            View Upgrade Options
          </Link>
        </div>
      </main>
    );
  }

  // If they ARE verified, show them the editing form
  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 pt-16 relative overflow-hidden font-mono">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-[100%] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 border-b border-white/10 pb-6">
          <h1 className="text-2xl font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Partner Storefront Settings</h1>
          <p className="text-[#8892B0] text-sm">Configure how your business appears in the ForeverLink Directory.</p>
        </div>

        <VendorForm vendor={vendor} tier={vendor.user.subscription?.tier?.toString() || "VENDOR_VERIFIED"} />
      </div>
    </main>
  );
}