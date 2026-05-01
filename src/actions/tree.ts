"use server";

import { auth } from "@/auth";
import { prisma } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addRelative(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const relationship = formData.get("relationship") as string;
    const birthYear = formData.get("birthYear") as string;
    const status = formData.get("status") as string;

    const fullName = `${firstName} ${lastName}`;
    const isDeceased = status === "Deceased";

    // 1. Create the relative in the database
    const relative = await prisma.user.create({
      data: {
        name: fullName,
        birthYear: birthYear,
        isDeceased: isDeceased,
      },
    });

    // 2. Determine where they sit on the tree
    let pId = session.user.id; // Default: You are the parent node
    let cId = relative.id;     // Default: They are the child node
    let relType = "BIOLOGICAL";

    if (relationship === "Parent") {
      pId = relative.id;
      cId = session.user.id;
    } else if (relationship === "Child") {
      pId = session.user.id;
      cId = relative.id;
    } else if (relationship === "Spouse") {
      pId = session.user.id;
      cId = relative.id;
      relType = "SPOUSE";
    } else if (relationship === "Sibling") {
      pId = session.user.id;
      cId = relative.id;
      relType = "SIBLING";
    }

    // 3. Lock the connection into the vault
    await prisma.familyLink.create({
      data: {
        parentId: pId,
        childId: cId,
        relationship: relType,
      },
    });
    
    revalidatePath("/dashboard/tree");
    return { success: true };
  } catch (error) {
    console.error("Failed to add relative:", error);
    return { success: false, error: "Failed to save to database" };
  }
}