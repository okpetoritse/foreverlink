"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize the cloud storage connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function archiveMilestone(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized Access");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const clearance = formData.get("clearance") as string;
  const mediaFile = formData.get("media") as File | null;

  if (!title || !content || !clearance) return;

  let mediaUrl = null;

// 🚀 BULLETPROOF MEDIA ENGINE
  if (mediaFile && mediaFile.size > 0) {
    console.log("1. Server received file:", mediaFile.name, "Size:", mediaFile.size);

    const fileExt = mediaFile.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const bucketName = 'milestone_media'; 

    console.log("2. Attempting Supabase upload...");

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, mediaFile, {
        contentType: mediaFile.type, 
        upsert: false
      });

    if (error) {
      console.error("🚨 Supabase Storage Error:", error);
    } else {
      console.log("3. Upload successful. Generating public URL...");
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      mediaUrl = publicUrlData.publicUrl;
      console.log("4. Generated URL:", mediaUrl);
    }
  }

  console.log("5. Saving to database with URL:", mediaUrl);

// 1. First, check your function arguments or variable declarations. 
// It likely looks like: const mediaUrl = formData.get("mediaUrl")... 

await prisma.milestone.create({
  data: {
    title,
    content,
    clearance,
    // ✅ Use 'mediaUrl' (or whatever your variable is named above)
    // We wrap it in [ ] because the database now expects an Array
    mediaUrls: mediaUrl ? [mediaUrl] : [], 
    authorId: userId,
    type: "MILESTONE",
  }
});

  revalidatePath("/dashboard/timeline");
}