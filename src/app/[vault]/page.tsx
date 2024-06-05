import VaultTemplate from "@/components/VaultTemplate";
import { auth } from "@clerk/nextjs/server";

import React from "react";

export default async function page() {
  const { userId } = auth();
  return (
    <div className="bg-accent-foreground flex justify-start pt-24 min-h-screen flex-col container relative">
      {userId && <VaultTemplate isEditable={false} userId={userId} />}
    </div>
  );
}
