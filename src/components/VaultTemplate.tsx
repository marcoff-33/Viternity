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
import FileUploader from "./fileUploader";
import { Editor } from "@tiptap/react";

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
    console.log(vaultData?.vaultText || "Nothing in here yet ...");
    const text = await server_getVaultTextContent(vaultData?.vaultText!);
    setVaultText(text);
  };

  useEffect(() => {
    handleFirstLoad();
  }, []);

  useEffect(() => {
    if (vaultData && vaultData.vaultText) {
      loadVaultText();
      console.log("loaded", vaultData, vaultId);
    }
  }, [vaultData]);

  const pathName = usePathname();
  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="flex justify-center flex-col">
      {vaultData?.imageUrls.length == 0 && isEditable && (
        <div className="flex justify-center items-center">
          Start by uploading an image and adding some text. Max 10mb size per
          image for free users.
        </div>
      )}
      {vaultData && (
        <>
          {isEditable && <FileUploader vaultId={vaultId} />}
          <ImagesCarousel vaultImages={vaultData!.imageUrls} />
        </>
      )}
      <div className="flex flex-col justify-center items-center gap-5 w-full">
        {vaultData && (
          <TextEditor
            editable={isEditable}
            vaultText={vaultText!}
            vaultId={vaultId}
            authorId={vaultData!.authorId}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
