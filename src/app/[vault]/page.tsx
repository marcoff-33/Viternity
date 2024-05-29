import { ImagesCarousel } from "@/components/ImagesCarousel";
import Tiptap from "@/components/TipTap";
import VaultTemplate from "@/components/VaultTemplate";
import FileUploader from "@/components/fileUploader";
import { auth } from "@clerk/nextjs/server";

import React from "react";

export default async function page() {
  const { userId } = auth();
  return (
    <div className="bg-red-50 flex justify-center h-screen flex-col container relative">
      {userId && <VaultTemplate isEditable={false} userId={userId} />}
    </div>
  );
}
