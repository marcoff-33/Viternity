import VaultTemplate from "@/components/VaultTemplate";
import React from "react";

export default function page() {
  return (
    <div className="flex justify-center min-h-screen flex-col container relative">
      <VaultTemplate isEditable={true} />
      <div className="sticky bottom-20 right-[50%]"></div>
    </div>
  );
}
