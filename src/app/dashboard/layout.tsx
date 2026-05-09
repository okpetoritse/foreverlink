import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 🔒 Security Check
  if (!session?.user) {
    redirect("/login");
  }

  // 🛡️ Server Action to handle secure sign out from the client component
  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex h-screen bg-[#0A192F] text-[#F5F5DC] overflow-hidden">
      
      {/* 🚀 Our new Client Component taking over UI duties */}
      <DashboardSidebar 
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        }} 
        onSignOut={handleSignOut} 
      />

      {/* 🖼️ MAIN CANVAS */}
      {/* Added pt-20 on mobile to push content below the fixed header */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full pt-20 md:pt-0">
        {children}
      </main>

    </div>
  );
}