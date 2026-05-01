"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase connection for storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ==========================================
// 📤 CREATE ENGINE
// ==========================================
export async function addAchievement(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateEarnedStr = formData.get("dateEarned") as string;
    const visibility = formData.get("visibility") as string || "PUBLIC";
    
    // We now look for an actual File object, not just a text link
    const file = formData.get("mediaFile") as File | null;
    let finalMediaUrl = formData.get("mediaUrl") as string; // Fallback if they just pasted a link

    // 🚀 THE UPLOAD ENGINE: If they attached a file, upload it to the Bucket
    if (file && file.size > 0) {
      // 1. Create a unique, secure filename so files don't overwrite each other
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${session.user.id}-${Date.now()}.${fileExtension}`;

      // 2. Send the raw file directly to your 'milestone_media' bucket
      const { data, error } = await supabase.storage
        .from("milestone_media")
        .upload(uniqueFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw new Error(`Storage error: ${error.message}`);

      // 3. Get the permanent public URL for the newly uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("milestone_media")
        .getPublicUrl(uniqueFileName);

      // 4. Overwrite the finalMediaUrl with our shiny new Supabase link
      finalMediaUrl = publicUrlData.publicUrl;
    }

    const dateEarned = dateEarnedStr ? new Date(dateEarnedStr) : new Date();

    // Lock the achievement into the database using the new URL
    await prisma.achievement.create({
      data: {
        title: title,
        description: description,
        dateEarned: dateEarned,
        visibility: visibility,
        mediaUrl: finalMediaUrl || null,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/achievements");
    return { success: true };
  } catch (error) {
    console.error("Failed to add achievement:", error);
    return { success: false, error: "Failed to save to database" };
  }
} // <--- This was the missing bracket!

// ==========================================
// 🗑️ DELETE ENGINE
// ==========================================
export async function deleteAchievement(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // SECURITY: We explicitly require the userId to match the session.
    // This makes it impossible to delete someone else's milestone.
    await prisma.achievement.delete({
      where: { 
        id: id,
        userId: session.user.id 
      },
    });

    revalidatePath("/dashboard/achievements");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete milestone:", error);
    return { success: false };
  }
}

// ==========================================
// ✏️ UPDATE ENGINE
// ==========================================
export async function updateAchievement(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const visibility = formData.get("visibility") as string || "PUBLIC";

    await prisma.achievement.update({
      where: { 
        id: id,
        userId: session.user.id 
      },
      data: {
        title: title,
        description: description,
      },
    });

    revalidatePath("/dashboard/achievements");
    return { success: true };
  } catch (error) {
    console.error("Failed to update milestone:", error);
    return { success: false };
  }
}