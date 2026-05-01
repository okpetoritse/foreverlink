"use server";

import { auth, prisma } from "@/auth";
import { Prisma } from "@prisma/client";

export async function createCheckoutSession(tier: "VENDOR_VERIFIED" | "VENDOR_ELITE") {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId || !userEmail) throw new Error("Unauthorized Access");

    let planCode = "";
    let amountInKobo = 0;

    if (tier === "VENDOR_ELITE") {
      planCode = process.env.PAYSTACK_PLAN_ELITE!;
      amountInKobo = 49000 * 100; // 49,000 NGN
    } else {
      planCode = process.env.PAYSTACK_PLAN_VERIFIED!;
      amountInKobo = 15000 * 100; // 15,000 NGN
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amountInKobo,
        plan: planCode,
        callback_url: `http://localhost:3000/dashboard/directory?success=true`,
        metadata: {
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userId,
            },
            {
              display_name: "Subscription Tier",
              variable_name: "tier",
              value: tier,
            }
          ]
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message);
    }

    return { url: data.data.authorization_url };
    
  } catch (error) {
    console.error("🚨 Paystack Checkout Error:", error);
    return { error: "Failed to initialize secure checkout." };
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== "success") {
      return { success: false, error: "Payment not confirmed by Paystack." };
    }

    // const metadata = data.data.metadata.custom_fields;
    // const userId = metadata.find((f: any) => f.variable_name === "user_id")?.value;
    // const tier = metadata.find((f: any) => f.variable_name === "tier")?.value;

    type PaystackField = {
  display_name: string;
  variable_name: string;
  value: string;
};

const metadata = data.data.metadata.custom_fields as PaystackField[];

const userId = metadata.find((f) => f.variable_name === "user_id")?.value;
const tier = metadata.find((f) => f.variable_name === "tier")?.value;

    if (!userId || !tier) throw new Error("Missing metadata in transaction.");

    // The Professional Atomic Transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.subscription.findUnique({ where: { userId } });
      if (existing) return; 

      const user = await tx.user.findUnique({ where: { id: userId } });

      await tx.subscription.create({
        data: {
          userId,
          tier: (tier as string).toUpperCase(),
          status: "ACTIVE",
        },
      });

      await tx.vendorProfile.create({
        data: {
          userId,
          businessName: `${user?.name || "Verified"}'s Professional Service`,
          category: tier.toUpperCase() === "VENDOR_ELITE" ? "Premium Partner" : "Verified Partner",
          isVerified: true,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Professional Verification Error:", error);
    return { success: false, error: "System failed to process upgrade." };
  }
}

// forcing vercel update for soft launch