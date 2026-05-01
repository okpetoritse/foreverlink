import UpgradeButton from "./UpgradeButton";
import { auth, prisma } from "@/auth";
import { verifyPayment } from "@/actions/paystack";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DirectoryPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const params = await searchParams;
  const reference = params?.reference as string;

  // Check if the current logged-in user is already a paying vendor
  const currentUserVendor = await prisma.vendorProfile.findUnique({
    where: { userId: userId }
  });

  if (reference) {
    console.log("Verifying payment for reference:", reference);
    await verifyPayment(reference);
  }

  const vendors = await prisma.vendorProfile.findMany({
    where: { isVerified: true },
    include: {
      user: {
        include: { 
          subscription: true 
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const premiumVendors = vendors.filter(
    (v) => v.user?.subscription?.tier?.toString().toUpperCase() === "VENDOR_ELITE"
  );
  
  const standardVendors = vendors.filter(
    (v) => v.user?.subscription?.tier?.toString().toUpperCase() !== "VENDOR_ELITE"
  );

  return (
    <main className="min-h-screen bg-[#0A192F] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500 opacity-[0.02] blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {reference && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-center animate-pulse">
            Transaction Processed! Directory updated.
          </div>
        )}

        <div className="mb-12 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">Family Network Directory</h1>
          <p className="text-[#F5F5DC]/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Connect with verified professionals trusted by the ForeverLink community. From Estate Lawyers to Genealogists, find the experts you need to secure your family's future.
          </p>
        </div>

       {/* 🆕 SMART VENDOR HUB OR UPGRADE ZONE */}
        {currentUserVendor?.isVerified ? (
          <div className="mb-16 bg-gradient-to-r from-[#0A192F] to-black border border-[#D4AF37]/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Your Partner Profile is Active</h3>
              <p className="text-[#F5F5DC]/70">You are currently listed in the directory. Keep your profile updated to attract more families.</p>
            </div>
            <a href="/dashboard/vendor" className="mt-4 md:mt-0 whitespace-nowrap bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-white transition-colors">
              Manage Profile
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl">
            <UpgradeButton 
              tier="VENDOR_VERIFIED" 
              label="Tier 1: Verified Badge (₦15,000/mo)" 
              description="Get the golden verification checkmark to prove your business is trusted."
            />
            <UpgradeButton 
              tier="VENDOR_ELITE" 
              label="Tier 2: Premium Placement (₦49,000/mo)" 
              description="Skip the line. Get featured at the absolute top of the directory."
            />
          </div>
        )}

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            <h2 className="text-2xl font-serif font-bold text-white">Featured Professionals</h2>
          </div>

          {premiumVendors.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <p className="text-white/50 mb-2">The premium directory is currently being curated.</p>
              <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold">Premium Placement Space Available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumVendors.map(vendor => (
                <div key={vendor.id} className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">Featured</div>
                  <h3 className="text-xl font-bold text-white mb-1">{vendor.businessName}</h3>
                  <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest mb-4">{vendor.category}</p>
                  <p className="text-sm text-white/70 mb-6 line-clamp-3">{vendor.description}</p>
                  <button className="w-full bg-[#D4AF37] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors text-sm">Contact Professional</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <h2 className="text-2xl font-serif font-bold text-white">Verified Directory</h2>
          </div>

          {standardVendors.length === 0 ? (
            <div className="border border-dashed border-white/20 rounded-2xl p-8 text-center">
              <p className="text-white/40 text-sm">No standard verified professionals found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {standardVendors.map(vendor => (
                <div key={vendor.id} className="bg-[#0A192F] border border-white/10 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold truncate">{vendor.businessName}</h3>
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">{vendor.category}</p>
                  <a href={`mailto:${vendor.user.email}`} className="text-blue-400 text-xs hover:text-white transition-colors">Message</a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}