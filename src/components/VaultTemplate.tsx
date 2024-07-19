"use client";

import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Vault } from "./UserVaults";
import {
  server_formatImageUrl,
  server_getVaultData,
  server_getVaultTextContent,
  server_updateVaultTitle,
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
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { CiEdit, CiHeart } from "react-icons/ci";
import { GiCandleLight } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import LikeCounter from "./LikeCounter";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import DefaultVault from "./DefaultVault";
import TextOnlyVault from "./TextOnlyVault";
import ImgOnlyVault from "./ImgOnlyVault";

export default function VaultTemplate({ isEditable }: { isEditable: boolean }) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("<p></p>");
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const pathName = usePathname();
  const [otpIsCorrect, setOtpIsCorrect] = useState<boolean>(
    pathName.includes("edit") ? false : true
  );
  const [vaultTitle, setVaultTitle] = useState<string>(
    vaultData?.vaultTitle || ""
  );
  const [showTitleEditor, setShowTitleEditor] = useState<boolean>(false);
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
    setVaultTitle(data.vaultTitle);
    setTheme(data.style);
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

  const handleUpdateTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vaultData || vaultData.vaultTitle === vaultTitle) {
      toast({
        title: "No change",
        description: "The title is the same, no update needed.",
        variant: "destructive",
      });
      return;
    }
    try {
      await server_updateVaultTitle(vaultId, vaultTitle);
      setVaultData({ ...vaultData, vaultTitle: vaultTitle });
      setShowTitleEditor(false);
      toast({
        title: "Success",
        description: "Vault title updated successfully",
        variant: "successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vault title",
        variant: "destructive",
      });
    }
  };

  // callback for the file uploader to updte the carousel images
  const handleNewImage = async (
    newImageUrl: string,
    action: "add" | "remove"
  ) => {
    const cdnImageUrl = await server_formatImageUrl(
      newImageUrl,
      "from storage to cdn"
    );
    if (vaultData)
      try {
        action === "add"
          ? (setVaultData({
              ...vaultData,
              imageUrls: [...vaultData.imageUrls, cdnImageUrl],
            }),
            toast({
              title: "Success",
              description: "Your new Images has been added",
            }))
          : (setVaultData({
              ...vaultData,
              imageUrls: vaultData.imageUrls.filter(
                (url) => url !== cdnImageUrl
              ),
            }),
            toast({
              title: "Success",
              description: "Your image has been removed",
            }));
      } catch (error) {
        toast({ title: "Error", description: `${error}` });
      }
  };

  const vaultId = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <div className="bg-background">
      <ImgOnlyVault
        otpIsCorrect={otpIsCorrect}
        isEditable={isEditable}
        vaultData={vaultData}
        vaultId={vaultId}
        handleNewImage={handleNewImage}
        handleUpdateTitle={handleUpdateTitle}
        setOtpIsCorrect={setOtpIsCorrect}
        setShowTitleEditor={setShowTitleEditor}
        showTitleEditor={showTitleEditor}
        loadEditor={loadEditor}
        vaultText={vaultText}
        setVaultTitle={setVaultTitle}
      />
    </div>
  );
}
