import { auth, prisma } from "@/auth";
import { removeConnection } from "@/actions/network";
import InviteForm from "./InviteForm"; // 🚀 Importing your new smart form!

export default async function NetworkDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // 🚀 LIVE DATABASE CONNECTION: Fetching from the NEW Graph Architecture
  const activeConnections = await prisma.familyConnection.findMany({
    where: { userId: userId },
    include: {
      connectedUser: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const pendingInvites = await prisma.invite.findMany({
    where: { inviterId: userId, status: "PENDING" },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* System Header */}
        <div className="border-b border-[#D4AF37]/30 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Lineage Network
            </h1>
            <p className="text-xs text-[#8892B0] mt-2 uppercase">Systematic Bridge Management // Secure Terminal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: THE INPUT ENGINE */}
          <div className="w-full">
            {/* We simply drop your newly created Client Component here */}
            <InviteForm /> 
          </div>

          {/* RIGHT COLUMN: The Data Grid */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TABLE 1: ACTIVE CONNECTIONS */}
            <div className="bg-[#0A192F]/50 border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 bg-[#0A192F] flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Active Network Bridges
                </h2>
                <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded font-bold">TOTAL: {activeConnections.length}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[10px] uppercase text-[#8892B0] bg-[#050B14] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-bold">Identity</th>
                      <th className="px-4 py-3 font-bold">Vector & Clearance</th>
                      <th className="px-4 py-3 font-bold">Bridge Date</th>
                      <th className="px-4 py-3 font-bold text-right">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeConnections.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#8892B0] text-xs italic">
                          No active bridges found. Network is currently isolated.
                        </td>
                      </tr>
                    ) : (
                      activeConnections.map((conn) => (
                        <tr key={conn.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="font-bold text-white flex items-center gap-2">
                              {conn.connectedUser.name || "Unknown"}
                            </div>
                            <div className="text-[10px] text-[#8892B0]">{conn.connectedUser.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] px-2 py-1 border rounded font-bold ${
                              conn.clearance === 'INNER' 
                                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' 
                                : 'bg-white/5 border-white/10 text-[#8892B0]'
                            }`}>
                              {conn.relationship} | {conn.clearance}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#8892B0]">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(conn.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <form action={async () => {
                              "use server";
                              await removeConnection(conn.id);
                            }}>
                              <button type="submit" className="text-[10px] text-red-400/70 hover:text-red-400 uppercase tracking-wider font-bold transition-colors">
                                Sever
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 2: PENDING INVITES */}
            {pendingInvites.length > 0 && (
              <div className="bg-[#0A192F]/50 border border-white/10 rounded-xl overflow-hidden shadow-xl opacity-70 hover:opacity-100 transition-opacity">
                <div className="p-4 border-b border-white/10 bg-[#0A192F] flex justify-between items-center">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Awaiting Cryptographic Handshake
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5">
                      {pendingInvites.map((invite) => (
                        <tr key={invite.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-white">{invite.email}</div>
                            <div className="text-[10px] text-yellow-400">PENDING ACCEPTANCE</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] px-2 py-1 border rounded font-bold bg-white/5 border-white/10 text-[#8892B0]">
                              {invite.relationship} | {invite.clearance}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#8892B0]">
                            Expires: {new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(invite.expiresAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}