"use client";

import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Vault } from "./UserVaults";
import {
  server_formatImageUrl,
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
import { set } from "zod";

export default function VaultTemplate({ isEditable }: { isEditable: boolean }) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("<p></p>");
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const pathName = usePathname();
  const [otpIsCorrect, setOtpIsCorrect] = useState<boolean>(
    pathName.includes("edit") ? false : true
  );
  const [error, setError] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);
  const [showText, setShowText] = useState<boolean>(false);

  const handleMessageAnimation = () => {
    setShowText(true);

    setTimeout(() => {
      setShowText(false);
    }, 4000);
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 5000);
  };

  useEffect(() => {
    handleMessageAnimation();
  }, [error]);

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
  const handleNewImage = async (
    newImageUrl: string,
    action: "add" | "remove"
  ) => {
    setError(null);
    const cdnImageUrl = await server_formatImageUrl(
      newImageUrl,
      "from storage to cdn"
    );
    if (vaultData)
      action === "add"
        ? (setVaultData({
            ...vaultData,
            imageUrls: [...vaultData.imageUrls, cdnImageUrl],
          }),
          setSuccessMessage("New image added"),
          handleMessageAnimation())
        : (setVaultData({
            ...vaultData,
            imageUrls: vaultData.imageUrls.filter((url) => url !== cdnImageUrl),
          }),
          setSuccessMessage("Image removed successfully"),
          handleMessageAnimation());
  };

  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="py-20">
      {otpIsCorrect ? (
        <div className="flex justify-center flex-col w-full relative">
          {isEditable ? (
            <div className="container self-center flex justify-between pb-10">
              <QrCodeModal />
              <div
                className={`grow text-center items-center transition-colors duration-400 delay-100 -z-50 px-2  rounded-full backdrop-blur-sm  max-w-fit ${
                  showText
                    ? `bg-accent-foreground/50 ${error ? "text-red-500" : ""} ${
                        successMessage ? "text-green-500" : ""
                      }`
                    : "text-transparent bg-transparent"
                }
                `}
              >
                {error || successMessage}
              </div>
              <FileUploader
                vaultId={vaultId}
                onUploadSuccess={handleNewImage}
                setError={setError}
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
                isEditable={isEditable}
              />
            </div>
          )}
          <div className="py-10 flex flex-col justify-center items-center gap-5 w-full">
            {loadEditor && vaultText && (
              <TextEditor
                editable={isEditable}
                vaultText={vaultText}
                vaultId={vaultId}
                handleAnimation={handleMessageAnimation}
                setSuccessMessage={setSuccessMessage}
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
