"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

// Initialize the Email Engine
const resend = new Resend(process.env.RESEND_API_KEY);

export async function addConnection(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  const senderName = session?.user?.name || "A ForeverLink Member";

  if (!userId) throw new Error("Unauthorized");

  // 1. Extract the exact data from the form inputs
  const email = formData.get("targetEmail") as string;
  const relationshipType = formData.get("relationshipType") as string;
  const accessLevel = formData.get("accessLevel") as string;

  if (!email || !relationshipType || !accessLevel) return;

  // 2. Locate the target node in the system
  let targetUser = await prisma.user.findUnique({ 
    where: { email } 
  });

  let isNewUser = false;

  // If the user doesn't exist yet, we create a placeholder node for them
  if (!targetUser) {
    isNewUser = true;
    targetUser = await prisma.user.create({
      data: {
        email,
        name: "Pending Invite",
      }
    });
  }

  // Prevent duplicate connections from crashing the system
  const existingConnection = await prisma.connection.findFirst({
    where: {
      ownerId: userId,
      connectedUserId: targetUser.id
    }
  });

  // 3. Establish the secure database bridge & Draw the Tree
  if (!existingConnection) {
    // A. Create the Security Access Connection
    await prisma.connection.create({
      data: {
        ownerId: userId,
        connectedUserId: targetUser.id,
        relationshipType,
        accessLevel,
      }
    });

    // B. 🌳 SYNCHRONIZE THE VISUAL FAMILY TREE
    // We draw the exact biological/marital lines instantly
    if (relationshipType === "Parent") {
      await prisma.familyLink.create({
        data: {
          parentId: targetUser.id, // They are the parent
          childId: userId,         // You are the child
          relationship: "BIOLOGICAL"
        }
      });
    } 
    else if (relationshipType === "Child") {
      await prisma.familyLink.create({
        data: {
          parentId: userId,        // You are the parent
          childId: targetUser.id,  // They are the child
          relationship: "BIOLOGICAL"
        }
      });
    }
    else if (relationshipType === "Spouse") {
      await prisma.familyLink.create({
        data: {
          parentId: userId,  
          childId: targetUser.id,
          relationship: "SPOUSE"
        }
      });
    }
    else if (relationshipType === "Sibling") {
      await prisma.familyLink.create({
        data: {
          parentId: userId,  
          childId: targetUser.id,
          relationship: "SIBLING"
        }
      });
    }
  }

  // 4. 🚀 THE EMAIL TRANSMISSION ENGINE 🚀
  try {
    if (isNewUser) {
      await resend.emails.send({
        from: "ForeverLink Network <onboarding@resend.dev>",
        to: email,
        subject: `You have been invited to ${senderName}'s Network`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">You've been invited to ForeverLink</h2>
            <p style="color: #444; font-size: 16px;">
              <strong>${senderName}</strong> has added you to their private network with <strong>${accessLevel}</strong> access.
            </p>
            <p style="color: #444; font-size: 16px;">
              Create your account to secure your connection and view their locked archives.
            </p>
            <a href="http://localhost:3000/register?email=${email}" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">
              Join ForeverLink
            </a>
          </div>
        `,
      });
      console.log(`Cold Invite sent successfully to ${email}`);
    } else {
      await resend.emails.send({
        from: "ForeverLink Network <onboarding@resend.dev>",
        to: email,
        subject: `${senderName} added you to their Network`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">Network Connection Updated</h2>
            <p style="color: #444; font-size: 16px;">
              <strong>${senderName}</strong> has just added you to their trusted network.
            </p>
            <a href="http://localhost:3000/dashboard/network" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">
              View Your Network
            </a>
          </div>
        `,
      });
      console.log(`Warm Notification sent successfully to ${email}`);
    }
  } catch (error) {
    console.error("🚨 Email Transmission Failed:", error);
  }

  // 5. Instantly refresh the Network Node UI
  revalidatePath("/dashboard/network");
}

export async function removeConnection(connectionId: string) {
  // Finding the connection to remove from both tables
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId }
  });

  if (connection) {
    // Remove the security bridge
    await prisma.connection.delete({ where: { id: connectionId } });
    
    // Remove the visual tree line (FamilyLink)
    await prisma.familyLink.deleteMany({
      where: {
        OR: [
          { parentId: connection.ownerId, childId: connection.connectedUserId },
          { parentId: connection.connectedUserId, childId: connection.ownerId }
        ]
      }
    });
  }
  
  revalidatePath("/dashboard/network");
}