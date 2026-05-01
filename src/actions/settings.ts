"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  // 1. Authenticate the request
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized access request.");
  }

  // 2. Extract incoming form data
  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  // 3. Prepare the update payload (Identity Only)
  const updateData: any = {};
  
  if (name && name.trim() !== "") {
    updateData.name = name;
  }
  
  if (image && image.trim() !== "") {
    updateData.image = image;
  }

  // 4. Commit to the Master Database
  // We removed the password check here because it does not exist in your schema
  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // 5. Force a system-wide UI refresh to show the new data
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard"); 
}