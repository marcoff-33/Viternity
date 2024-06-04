"use client";

import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Vault } from "./UserVaults";
import {
  server_getVaultData,
  server_getVaultTextContent,
} from "@/app/utils/serverActions";
import { ImagesCarousel } from "./ImagesCarousel";
import TextEditor from "./TipTap";

export default function VaultTemplate({
  userId,
  isEditable,
}: {
  userId: string;
  isEditable: boolean;
}) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("");

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
  };
  const loadVaultText = async () => {
    console.log(vaultData?.vaultText);
    const text = await server_getVaultTextContent(vaultData?.vaultText!);
    setVaultText(text);
  };

  useEffect(() => {
    handleFirstLoad();
  }, []);

  useEffect(() => {
    if (vaultData) {
      loadVaultText();
      console.log("loaded", vaultData, vaultId);
    }
  }, [vaultData]);

  const pathName = usePathname();
  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="flex justify-center flex-col">
      {vaultData && vaultText && (
        <>
          <ImagesCarousel vaultImages={vaultData!.imageUrls} />
          <TextEditor
            editable={isEditable}
            vaultText={vaultText}
            vaultId={vaultId}
            authorId={vaultData.authorId}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}
