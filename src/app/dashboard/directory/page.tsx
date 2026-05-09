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
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 relative overflow-hidden font-mono">
      {/* Premium Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {reference && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-center animate-pulse text-sm tracking-widest uppercase font-bold">
            Transaction Processed! Directory Security Updated.
          </div>
        )}

        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-3 tracking-widest uppercase">Family Network Directory</h1>
            <p className="text-[#8892B0] text-sm max-w-2xl leading-relaxed">
              Connect with verified professionals trusted by the ForeverLink community. From Estate Lawyers to Genealogists, find the experts you need to secure your legacy.
            </p>
          </div>
        </div>

       {/* 🆕 SMART VENDOR HUB OR UPGRADE ZONE */}
        {currentUserVendor?.isVerified ? (
          <div className="mb-16 bg-[#0A192F]/80 border border-[#D4AF37]/30 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Your Partner Profile is Active</h3>
              <p className="text-[#8892B0] text-sm">You are currently listed in the directory. Ensure your logo and details are up to date.</p>
            </div>
            <a href="/dashboard/vendor" className="mt-6 md:mt-0 whitespace-nowrap bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/20 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded transition-colors">
              Manage Profile
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl">
            <UpgradeButton 
              tier="VENDOR_VERIFIED" 
              label="Tier 1: Verified Badge (₦15,000/mo)" 
              description="Get the blue verification checkmark to prove your business is trusted."
            />
            <UpgradeButton 
              tier="VENDOR_ELITE" 
              label="Tier 2: Premium Placement (₦49,000/mo)" 
              description="Get the gold card. Featured at the absolute top of the directory with logo space."
            />
          </div>
        )}

        {/* 🌟 TIER 2: ELITE FEATURED PROFESSIONALS */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Featured Elite Partners</h2>
          </div>

          {premiumVendors.length === 0 ? (
            <div className="bg-[#0A192F]/50 border border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <p className="text-[#8892B0] text-sm mb-2">The premium directory is currently being curated.</p>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Elite Placement Space Available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {premiumVendors.map(vendor => (
                <div key={vendor.id} className="relative group rounded-xl overflow-hidden bg-[#0A192F]/80 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                  
                  {/* The Elite Gold Header Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37]"></div>

                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                        {/* Logo Space (Ready for the Upload feature) */}
                        <div className="w-16 h-16 rounded-full bg-[#050B14] border-2 border-[#D4AF37]/50 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                          <svg className="w-6 h-6 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-serif font-bold text-white tracking-wide">{vendor.businessName}</h3>
                          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mt-1 font-bold">{vendor.category}</p>
                        </div>
                      </div>

                      <span className="hidden sm:inline-block shrink-0 bg-gradient-to-r from-[#D4AF37] to-[#AA8529] text-[#050B14] text-[9px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                        Featured
                      </span>
                    </div>

                    <p className="text-[#8892B0] text-sm leading-relaxed mb-8 line-clamp-3 font-sans">
                      {vendor.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <a href={`mailto:${vendor.user.email}`} className="flex-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Contact Partner
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🛡️ TIER 1: STANDARD VERIFIED DIRECTORY */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Verified Network</h2>
          </div>

          {standardVendors.length === 0 ? (
            <div className="border border-dashed border-[#233554] rounded-xl p-8 text-center bg-[#0A192F]/30">
              <p className="text-[#8892B0] text-sm">No standard verified professionals found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standardVendors.map(vendor => (
                <div key={vendor.id} className="bg-[#0A192F]/50 border border-[#233554] rounded-xl p-5 hover:border-blue-500/50 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#050B14] border border-[#233554] flex items-center justify-center shrink-0 overflow-hidden">
                         <svg className="w-4 h-4 text-[#8892B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    </div>
                    <h3 className="text-white font-bold tracking-wide text-sm mb-1 line-clamp-1">{vendor.businessName}</h3>
                    <p className="text-[9px] text-[#8892B0] uppercase tracking-widest mb-4">{vendor.category}</p>
                  </div>
                  
                  <a href={`mailto:${vendor.user.email}`} className="block w-full text-center bg-[#112240] hover:bg-[#233554] border border-[#233554] text-white text-[10px] uppercase tracking-widest font-bold py-2.5 rounded transition-colors">
                    Message
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}