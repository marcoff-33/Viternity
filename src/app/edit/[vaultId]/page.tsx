import QrCodeModal from "@/components/QrCodeModal";
import VaultTemplate from "@/components/VaultTemplate";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function page() {
  const { userId } = auth();
  return (
    <div className="bg-red-50 flex justify-center min-h-screen flex-col container relative">
      {userId ? (
        <>
          <UserButton />
          <VaultTemplate isEditable={true} userId={userId} />
          <div className="sticky bottom-20 right-[50%]">
            <QrCodeModal />
          </div>
        </>
      ) : (
        <div className="">You need to be logged in to edit this vault.</div>
      )}
    </div>
  );
}
