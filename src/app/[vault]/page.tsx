import VaultTemplate from "@/components/VaultTemplate";
import { auth } from "@clerk/nextjs/server";

import React from "react";

export default async function page() {
  const { userId } = auth();
  return (
    <div className="flex justify-center min-h-screen flex-col container relative">
      {userId && <VaultTemplate isEditable={false} userId={userId} />}
    </div>
  );
}
