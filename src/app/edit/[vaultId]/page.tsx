import { auth } from "@/app/utils/auth";
import VaultTemplate from "@/components/VaultTemplate";
import React from "react";

export default async function page() {
  return (
    <div className="bg-background flex justify-start  min-h-screen flex-col container relative">
      <VaultTemplate isEditable={true} />
      <div className="sticky bottom-20 right-[50%]"></div>
    </div>
  );
}
