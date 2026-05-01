"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// 🔐 Using the secure Service Role key for backend vault uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function sealTimeVault(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized Access");

    // 1. Extract the secure data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string; // The new secret text
    const unlockDateStr = formData.get("unlockDate") as string;
    const file = formData.get("media") as File | null;

    if (!title || !unlockDateStr) return { success: false, error: "Missing required fields" };

    const unlockDate = new Date(unlockDateStr);
    let finalMediaUrl = null;

    // 2. 🚀 THE VAULT UPLOAD ENGINE (Strictly to vault-media)
    if (file && file.size > 0) {
      console.log(`Securing vault media: ${file.name}`);
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `vault-${userId}-${Date.now()}.${fileExtension}`;

      // Routing to the highly secure vault bucket
      const { error } = await supabase.storage
        .from("vault-media")
        .upload(uniqueFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw new Error(`Storage error: ${error.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("vault-media")
        .getPublicUrl(uniqueFileName);

      finalMediaUrl = publicUrlData.publicUrl;
      console.log("Vault media secured at:", finalMediaUrl);
    }

    // 3. 🔒 COMMIT TO THE CRYPTOGRAPHIC DATABASE
    await prisma.timeVault.create({
      data: {
        title: title,
        content: content, 
        unlockDate: unlockDate,
        creatorId: userId,
        mediaUrl: finalMediaUrl,
        isSealed: true
      },
    });

    revalidatePath("/dashboard/vault");
    return { success: true };
    
  } catch (error) {
    console.error("Failed to create vault:", error);
    return { success: false, error: "Failed to seal vault" };
  }
}