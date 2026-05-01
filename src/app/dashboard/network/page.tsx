import { auth, prisma } from "@/auth";
import { addConnection, removeConnection } from "@/actions/network";

export default async function NetworkDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // 🚀 LIVE DATABASE CONNECTION: Fetching real data from Supabase
  const connections = await prisma.connection.findMany({
    where: { ownerId: userId },
    include: {
      connectedUser: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* System Header */}
        <div className="border-b border-[#D4AF37]/30 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Lineage Network Node
            </h1>
            <p className="text-xs text-[#F5F5DC]/50 mt-2 uppercase">Systematic Lineage Management // Auth Level: Alpha</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: THE INPUT ENGINE */}
          <div className="w-full bg-[#112240] p-6 border border-[#233554] rounded-md shadow-lg">
            <h2 className="text-[#64FFDA] text-sm tracking-widest uppercase mb-6 font-semibold flex items-center gap-2">
              <span>+</span> Establish Bridge
            </h2>

            {/* 🚀 THE LIVE INPUT ENGINE */}
            <form action={addConnection} className="space-y-5">
              
              {/* Input 1: The Target Email */}
              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">
                  Target Node (Email)
                </label>
                <input
                  type="email"
                  name="targetEmail"
                  required
                  placeholder="relative@example.com"
                  className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#64FFDA] focus:outline-none focus:ring-1 focus:ring-[#64FFDA] transition-all"
                />
              </div>

              {/* Input 2: The Identity Vector */}
              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">
                  Identity Vector
                </label>
                <select name="relationshipType" required defaultValue="" className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#64FFDA] focus:outline-none focus:ring-1 focus:ring-[#64FFDA] transition-all appearance-none">
                  <option value="" disabled>Select Relationship...</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Descendant (Child)</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Friend">Extended / Friend</option>
                </select>
              </div>

              {/* Input 3: The Security Clearance */}
              <div>
                <label className="block text-[#8892B0] text-xs uppercase tracking-wider mb-2">
                  Security Clearance
                </label>
                <select name="accessLevel" required defaultValue="" className="w-full bg-[#0A192F] border border-[#233554] text-[#CCD6F6] text-sm p-2.5 rounded focus:border-[#64FFDA] focus:outline-none focus:ring-1 focus:ring-[#64FFDA] transition-all appearance-none">
                  <option value="" disabled>Assign Access Level...</option>
                  <option value="INNER_CIRCLE">Inner Circle (Full Timeline Access)</option>
                  <option value="EXTENDED">Extended Network (Public Memories Only)</option>
                </select>
                <p className="mt-2 text-[#8892B0] text-[10px] leading-tight">
                  * Inner Circle bypasses privacy locks. Extended Network respects "Descendants Only" restrictions.
                </p>
              </div>

              {/* Submit Engine */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-transparent border border-[#64FFDA] text-[#64FFDA] text-xs uppercase tracking-widest py-3 rounded hover:bg-[#64FFDA]/10 transition-colors"
                >
                  Transmit Invite
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: The Data Grid */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 border border-white/10 rounded-sm overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Network Bridges</h2>
                <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1">TOTAL: {connections.length}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[10px] uppercase text-[#F5F5DC]/50 bg-black/60 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-normal">Identity</th>
                      <th className="px-4 py-3 font-normal">Clearance</th>
                      <th className="px-4 py-3 font-normal">Bridge Date</th>
                      <th className="px-4 py-3 font-normal text-right">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {connections.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#F5F5DC]/30 text-xs italic">
                          No active bridges found. Network is isolated.
                        </td>
                      </tr>
                    ) : (
                      connections.map((conn) => (
                        <tr key={conn.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="font-bold text-white flex items-center gap-2">
                              {conn.connectedUser.name || "Unknown"}
                            </div>
                            <div className="text-[10px] text-[#F5F5DC]/50">{conn.connectedUser.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] px-2 py-1 border rounded-sm ${
                              conn.accessLevel === 'INNER_CIRCLE' 
                                ? 'bg-[#64FFDA]/10 border-[#64FFDA]/30 text-[#64FFDA]' 
                                : 'bg-white/5 border-white/10 text-[#F5F5DC]/70'
                            }`}>
                              {conn.relationshipType} | {conn.accessLevel === 'INNER_CIRCLE' ? 'INNER' : 'EXTENDED'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#F5F5DC]/70">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(conn.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <form action={async () => {
                              "use server";
                              await removeConnection(conn.id);
                            }}>
                              <button type="submit" className="text-[10px] text-red-400/70 hover:text-red-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>

        </div>
      </div>
    </main>
  );
}