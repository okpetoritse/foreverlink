"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateVendorProfile(data: {
  businessName: string;
  category: string;
  description: string;
  websiteUrl: string;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) return { error: "Unauthorized access." };

    // Update the database safely
    await prisma.vendorProfile.update({
      where: { userId: userId },
      data: {
        businessName: data.businessName,
        category: data.category,
        description: data.description,
        websiteUrl: data.websiteUrl,
      }
    });

    // This forces Next.js to refresh the Directory page so changes show up instantly
    revalidatePath("/dashboard/directory");
    
    return { success: true };
  } catch (error) {
    console.error("🚨 Profile Update Error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}