import { auth, prisma } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // Fetch their current profile securely from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
    }
  });

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#D4AF37]/30 pb-4">
          <h1 className="text-2xl font-bold text-[#D4AF37] tracking-widest uppercase">Profile Settings</h1>
          <p className="text-xs text-[#F5F5DC]/50 mt-2 uppercase">Manage your identity and vault security.</p>
        </div>

        {/* The Client Form */}
        <SettingsForm user={user} />

      </div>
    </main>
  );
}