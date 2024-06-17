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
import OtpInput from "./OtpInput";
import path from "path";
import QrCodeModal from "./QrCodeModal";
import Link from "next/link";

export default function VaultTemplate({ isEditable }: { isEditable: boolean }) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("<p></p>");
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const pathName = usePathname();
  const [otpIsCorrect, setOtpIsCorrect] = useState<boolean>(
    pathName.includes("edit") ? false : true
  );

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
  };
  const loadVaultText = async () => {
    if (vaultData && vaultData.vaultText) {
      const text = await server_getVaultTextContent(vaultData.vaultText);
      setVaultText(text);
    }
  };

  useEffect(() => {
    handleFirstLoad();
  }, []);

  useEffect(() => {
    if (vaultData) {
      loadVaultText();
      setLoadEditor(true);
      console.log("loaded", vaultData, vaultId);
    }
  }, [vaultData]);

  // callback for the file uploader to updte the carousel images
  const handleNewImage = (newImageUrl: string, action: "add" | "remove") => {
    if (vaultData)
      action === "add"
        ? setVaultData({
            ...vaultData,
            imageUrls: [...vaultData.imageUrls, newImageUrl],
          })
        : setVaultData({
            ...vaultData,
            imageUrls: vaultData.imageUrls.filter((url) => url !== newImageUrl),
          });
  };

  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="py-20">
      {otpIsCorrect ? (
        <div className="flex justify-center flex-col w-full relative">
          {isEditable ? (
            <div className="container self-center flex justify-between pb-10">
              <QrCodeModal />
              <FileUploader
                vaultId={vaultId}
                onUploadSuccess={handleNewImage}
              />
            </div>
          ) : (
            <Link
              href={`/edit/${vaultId}`}
              className="self-end text-center items-center font-semibold sm:text-lg relative bg-accent-foreground text-primary max-w-fit sm:pr-10 "
            >
              Edit Vault
            </Link>
          )}
          {vaultData && (
            <div className="self-center">
              <ImagesCarousel
                vaultImages={vaultData!.imageUrls}
                vaultId={vaultId}
                onImageDelete={handleNewImage}
              />
            </div>
          )}
          <div className="py-10 flex flex-col justify-center items-center gap-5 w-full">
            {loadEditor && vaultText && (
              <TextEditor
                editable={isEditable}
                vaultText={vaultText}
                vaultId={vaultId}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          {vaultData && isEditable && (
            <OtpInput
              vaultPassword={vaultData!.vaultPassword}
              setOtpIsCorrect={setOtpIsCorrect}
            />
          )}
        </div>
      )}
    </div>
  );
}
