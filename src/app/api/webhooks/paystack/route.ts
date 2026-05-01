import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/auth";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY || ""; 

    // 1. Cryptographic Security Check
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    if (hash !== signature) {
      console.error("🚨 Unauthorized Webhook Attempt");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // 2. Process Successful Payments
    if (event.event === "charge.success") {
      const data = event.data;
      const userId = data.metadata?.userId; 
      
      // Check the metadata to see WHAT they paid for
      const customFields = data.metadata?.custom_fields || [];
      const upgradeTypeField = customFields.find((f: any) => f.variable_name === "upgrade_type");
      const upgradeType = upgradeTypeField ? upgradeTypeField.value : null;

      if (userId) {
        
        // 🛠️ SCENARIO A: B2B Vendor Paid $15 or $49
        if (upgradeType === "Verified Vendor Premium") {
           await prisma.vendorProfile.update({
             where: { userId: userId },
             data: { isVerified: true },
           });
           console.log(`✅ B2B Revenue: Vendor Upgraded to Verified: ${userId}`);
        } 
        
        // 👨‍👩‍👧 SCENARIO B: B2C Family Paid $4.99 for Storage
        else if (upgradeType === "storage") {
           // We map this directly to your PlanTier Enum!
           // Note: Ensure the column name in your User model is actually `planTier` (change it below if it is named `plan` or `tier`)
           await prisma.user.update({
             where: { id: userId },
             data: { planTier: "VAULT_PREMIUM" }, 
           });
           console.log(`✅ B2C Revenue: Family Upgraded to VAULT_PREMIUM: ${userId}`);
        }

      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}