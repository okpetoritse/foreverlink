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
      <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 pt-16 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-serif font-bold text-white mb-4">Partner Hub Locked</h1>
          <p className="text-white/70 mb-8">You must be a Verified Professional to access the vendor dashboard and customize your business profile.</p>
          <Link href="/dashboard/directory" className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors">
            View Upgrade Options
          </Link>
        </div>
      </main>
    );
  }

  // If they ARE verified, show them the editing form
  return (
    <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500 opacity-[0.02] blur-[120px] rounded-[100%] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        <VendorForm vendor={vendor} tier={vendor.user.subscription?.tier || "VENDOR_VERIFIED"} />
      </div>
    </main>
  );
}