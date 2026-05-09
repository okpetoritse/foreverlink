"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: { name: string; image: string }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized Access" };
  }

  try {
    // Lock the new name and image into the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        image: data.image, 
      }
    });

    // Refresh the settings page and the sidebar so the new avatar appears everywhere instantly
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to secure profile data." };
  }
}