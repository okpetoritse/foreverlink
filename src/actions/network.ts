"use server";

import { auth, prisma } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { RelType, ClearanceLevel } from "@prisma/client";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// 1. THE SENDER ENGINE (Creating Invites)
// ==========================================
export async function sendFamilyInvite(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  const senderName = session?.user?.name || "A ForeverLink Member";

  if (!userId) throw new Error("Unauthorized");

  const email = formData.get("targetEmail") as string;
  const relationshipStr = formData.get("relationshipType") as string; 
  const accessLevel = (formData.get("accessLevel") as ClearanceLevel) || "EXTENDED";

  if (!email || !relationshipStr) return { success: false, error: "Missing required fields." };

  const relationship = relationshipStr as RelType;
  const targetUser = await prisma.user.findUnique({ where: { email } });

  try {
    if (!targetUser) {
      // COLD INVITE
      const token = crypto.randomBytes(32).toString("hex");

      await prisma.invite.create({
        data: {
          email,
          token,
          relationship,
          clearance: accessLevel,
          inviterId: userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        }
      });

      await resend.emails.send({
        from: "ForeverLink Network <onboarding@resend.dev>",
        to: email,
        subject: `You have been invited to ${senderName}'s Network`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">You've been invited to ForeverLink</h2>
            <p style="color: #444; font-size: 16px;"><strong>${senderName}</strong> has added you to their private family network.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}" style="background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">
              Accept Invitation & Join
            </a>
          </div>
        `,
      });
    } else {
      // WARM INVITE
      const existingConnection = await prisma.familyConnection.findFirst({
        where: { userId, connectedUserId: targetUser.id }
      });

      if (!existingConnection) {
        let mirrorRelationship: RelType;
        if (relationship === "SPOUSE") mirrorRelationship = "SPOUSE";
        else if (relationship === "SIBLING") mirrorRelationship = "SIBLING";
        else if (relationship === "PARENT") mirrorRelationship = "CHILD";
        else if (relationship === "CHILD") mirrorRelationship = "PARENT";
        else throw new Error("Invalid alignment.");

        await prisma.$transaction([
          prisma.familyConnection.create({ data: { userId, connectedUserId: targetUser.id, relationship, clearance: accessLevel } }),
          prisma.familyConnection.create({ data: { userId: targetUser.id, connectedUserId: userId, relationship: mirrorRelationship, clearance: accessLevel } })
        ]);

        await resend.emails.send({
          from: "ForeverLink Network <onboarding@resend.dev>",
          to: email,
          subject: `${senderName} established a Lineage Connection`,
          html: `<p><strong>${senderName}</strong> has established a permanent lineage bridge with you.</p>`
        });
      }
    }

    revalidatePath("/dashboard/network");
    revalidatePath("/dashboard/tree");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to process the network connection." };
  }
}

// ==========================================
// 2. THE RECEIVER ENGINE (Accepting Invites)
// ==========================================
export async function acceptFamilyInvite(token: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) return { success: false, error: "You must be logged in." };

  try {
    const invite = await prisma.invite.findUnique({ where: { token } });

    if (!invite) return { success: false, error: "Invalid lineage token." };
    if (invite.status !== "PENDING") return { success: false, error: "Invite already claimed." };
    if (invite.expiresAt < new Date()) return { success: false, error: "Invite expired." };
    if (invite.inviterId === currentUserId) return { success: false, error: "Cannot accept your own invite." };

    let mirrorRelationship: RelType;
    switch (invite.relationship) {
      case "SPOUSE": mirrorRelationship = "SPOUSE"; break;
      case "SIBLING": mirrorRelationship = "SIBLING"; break;
      case "PARENT": mirrorRelationship = "CHILD"; break;
      case "CHILD": mirrorRelationship = "PARENT"; break;
      default: throw new Error("Unknown relationship.");
    }

    await prisma.$transaction(async (tx) => {
      // Burn the invite
      await tx.invite.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED" },
      });
      // Forward Link
      await tx.familyConnection.create({
        data: { userId: invite.inviterId, connectedUserId: currentUserId, relationship: invite.relationship, clearance: invite.clearance },
      });
      // Mirror Link
      await tx.familyConnection.create({
        data: { userId: currentUserId, connectedUserId: invite.inviterId, relationship: mirrorRelationship, clearance: invite.clearance },
      });
    });

    revalidatePath("/dashboard/network");
    revalidatePath("/dashboard/tree");
    return { success: true };

  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Connection already established." };
    return { success: false, error: "Failed to forge connection." };
  }
}

// ==========================================
// 3. THE SEVER ENGINE (Removing Connections)
// ==========================================
export async function removeConnection(connectionId: string) {
  const connection = await prisma.familyConnection.findUnique({ where: { id: connectionId } });

  if (connection) {
    await prisma.$transaction([
      prisma.familyConnection.delete({ where: { id: connectionId } }),
      prisma.familyConnection.deleteMany({
        where: { userId: connection.connectedUserId, connectedUserId: connection.userId }
      })
    ]);
  }
  
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/tree");
}