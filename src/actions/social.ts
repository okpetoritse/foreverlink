"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleStar(milestoneId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  // Check if they already starred it
  const existingLike = await prisma.like.findUnique({
    where: {
      milestoneId_userId: { milestoneId, userId }
    }
  });

  if (existingLike) {
    // If it exists, remove the star (Unlike)
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    // If it doesn't exist, add the star (Like)
    await prisma.like.create({ data: { milestoneId, userId } });
  }

  revalidatePath("/dashboard/timeline");
}

export async function addComment(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const milestoneId = formData.get("milestoneId") as string;
  const text = formData.get("text") as string;

  if (!milestoneId || !text) return;

  await prisma.comment.create({
    data: {
      text,
      milestoneId,
      userId
    }
  });

  revalidatePath("/dashboard/timeline");
}