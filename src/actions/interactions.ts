"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";

// ==========================================
// 🌟 1. THE STAR (LIKE) ENGINE
// ==========================================
export async function toggleStar(achievementId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;

    const existingStar = await prisma.star.findUnique({
      where: {
        userId_achievementId: {
          userId: userId,
          achievementId: achievementId,
        },
      },
    });

    if (existingStar) {
      await prisma.star.delete({
        where: { id: existingStar.id },
      });
    } else {
      await prisma.star.create({
        data: {
          userId: userId,
          achievementId: achievementId,
        },
      });
    }

    revalidatePath("/dashboard/achievements");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle star:", error);
    return { success: false };
  }
}

// ==========================================
// 💬 2. THE COMMENT ENGINE
// ==========================================
export async function addComment(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const text = formData.get("text") as string;
    const achievementId = formData.get("achievementId") as string;

    if (!text || text.trim() === "") {
      return { success: false, error: "Comment cannot be empty" };
    }

    await prisma.comment.create({
      data: {
        text: text.trim(),
        userId: session.user.id,
        achievementId: achievementId,
      },
    });

    revalidatePath("/dashboard/achievements");
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false };
  }
}