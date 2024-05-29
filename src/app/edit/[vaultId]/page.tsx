import VaultTemplate from "@/components/VaultTemplate";
import VaultEditor from "@/components/vaultEditor";
import { auth } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";
import React from "react";

export default function page() {
  const { userId } = auth();
  return (
    <div className="bg-red-50 flex justify-center min-h-screen flex-col container">
      {userId ? (
        <VaultTemplate isEditable={true} userId={userId} />
      ) : (
        <div className="">You need to be logged in to edit this vault.</div>
      )}
    </div>
  );
}
