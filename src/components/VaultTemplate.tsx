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

export default function VaultTemplate({
  userId,
  isEditable,
}: {
  userId: string;
  isEditable: boolean;
}) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("<p></p>");
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const [otpIsCorrect, setOtpIsCorrect] = useState<boolean>(false);

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
  const handleNewImage = (newImageUrl: string) => {
    if (vaultData) {
      setVaultData({
        ...vaultData,
        imageUrls: [...vaultData.imageUrls, newImageUrl],
      });
    }
  };

  const pathName = usePathname();
  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="">
      {otpIsCorrect ? (
        <div className="flex justify-center flex-col w-full">
          {vaultData?.imageUrls.length == 0 && isEditable && (
            <div className="flex justify-center items-center">
              Start by uploading an image and adding some text. Max 10mb size
              per image for free users.
            </div>
          )}
          {vaultData && (
            <div className="self-center ">
              {isEditable && (
                <FileUploader
                  vaultId={vaultId}
                  onUploadSuccess={handleNewImage}
                />
              )}
              <ImagesCarousel vaultImages={vaultData!.imageUrls} />
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-5 w-full">
            {loadEditor && vaultText && (
              <TextEditor
                editable={isEditable}
                vaultText={vaultText}
                vaultId={vaultId}
                authorId={vaultData!.authorId}
                userId={userId}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          {vaultData && (
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
