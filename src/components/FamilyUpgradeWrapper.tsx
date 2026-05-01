"use client";

import dynamic from "next/dynamic";

// This safely forces the Paystack code to ONLY load in the browser window
const FamilyUpgradeButton = dynamic(
  () => import("@/components/FamilyUpgradeButton"),
  { ssr: false }
);

export default function FamilyUpgradeWrapper({ userId, email }: { userId: string, email: string }) {
  return <FamilyUpgradeButton userId="{userId}" email="{email}"/>;
}