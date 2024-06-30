import VaultTemplate from "@/components/VaultTemplate";
import { auth } from "@clerk/nextjs/server";

import React from "react";

export default async function page() {
  return (
    <div className="bg-background flex justify-start min-h-screen flex-col container relative">
      <VaultTemplate isEditable={false} />
    </div>
  );
}
