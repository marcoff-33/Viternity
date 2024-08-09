"use client";

import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Vault, vaultTemplate } from "./UserVaults";
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
import TemplateSwitcher from "./TemplateSwitcher";
import { useSession } from "next-auth/react";

// TODO !!!! implement file deletion when deleting a vault

export default function VaultTemplate({ isEditable }: { isEditable: boolean }) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const [vaultText, setVaultText] = useState<string | undefined>("");
  const [isPrivate, setIsPrivate] = useState<boolean | undefined>(undefined);
  const [vaultPassword, setVaultPassword] = useState<string | undefined>(
    undefined
  );
  const [loadEditor, setLoadEditor] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<vaultTemplate>(
    vaultData?.vaultTemplate || "Default"
  );
  const pathName = usePathname();
  const [otpIsCorrect, setOtpIsCorrect] = useState<boolean | undefined>(
    undefined
  );
  const [vaultTitle, setVaultTitle] = useState<string>(
    vaultData?.vaultTitle || ""
  );
  const [showTitleEditor, setShowTitleEditor] = useState<boolean>(false);
  const [blockAccess, setBlockAccess] = useState<boolean | undefined>(
    undefined
  );

  // this is to keep track of text editor content after a user saves, in case of unmounting and remounting a template
  // otherwise the content will be the outdated fetched text.
  const [newContent, setNewContent] = useState<string | undefined>(undefined);

  const { toast } = useToast();
  const { setTheme } = useTheme();
  const session = useSession();
  const userId = session.data?.user.userId;
  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    // isEditable prop is either true or false depending on if we are in the /edit URL path or not(passed from parent page component)
    // allowCollab and isPrivate are both privacy settings that, if true, will require a password to access the vault.
    const isPasswordProtected = isEditable ? data.allowCollab : data.isPrivate;
    const vaultPassword = isEditable ? data.collabPassword : data.vaultPassword;

    // this function is responsible for blocking anyone but the original author from editing the page.
    // if the page is not editable by other users(allowCollab is false),
    // blockAcess will return true and be passed to the otp input as props, rendering a message instead of the password.
    const blockAccess = () => {
      if (isEditable && !isPasswordProtected && userId !== data.authorId) {
        // !isPasswordProtected just means the vault has no password requirement to edit.
        // it's only editable by the author if logged in. (only relevant to /edit URL)
        return true;
      }
      return false;
    };
    setVaultData(data);
    setVaultTitle(data.vaultTitle);
    setTheme(data.style);
    setCurrentTemplate(data.vaultTemplate);
    // by setting the otp state to !isPasswordProtected, it will default to true if isPasswordProtected is false(public vault), avoiding the need to render it.
    // blockAccess will check if we are on the edit URL(isEditable) and block anyone but the original author from editing the page unless allowCollab is true.
    if (!blockAccess()) {
      setOtpIsCorrect(!isPasswordProtected);
    }
    setVaultPassword(vaultPassword);
    setBlockAccess(blockAccess());
  };

  const loadVaultText = async () => {
    if (vaultData && vaultData.vaultText) {
      console.log(vaultData.vaultText);
      const text = await server_getVaultTextContent(vaultData.vaultText);
      setVaultText(text);
    }
  };

  useEffect(() => {
    handleFirstLoad();
    console.log("first load");
  }, []);

  useEffect(() => {
    if (vaultData) {
      loadVaultText();
      setLoadEditor(true);
      console.log("loaded", vaultData, vaultId);
      console.log(loadEditor);
    }
  }, [vaultData]);

  // used as callback to change the vault title both on db and client side
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

  // callback for the file uploader to updte the carousel images state.
  const handleNewImage = async (
    newImageUrl: string,
    action: "add" | "remove",
    index?: number
  ) => {
    const cdnImageUrl = await server_formatImageUrl(
      newImageUrl,
      "from storage to cdn"
    );
    if (vaultData)
      try {
        if (action === "add") {
          setVaultData({
            ...vaultData,
            imageUrls: [...vaultData.imageUrls, cdnImageUrl],
            imageDescriptions: [
              ...vaultData.imageDescriptions,
              "Edit Description",
            ],
          });
          toast({
            title: "Success",
            description: "Your new Images has been added",
          });
        } else if (action === "remove") {
          const newImageUrls = vaultData.imageUrls.filter(
            (url) => url !== cdnImageUrl
          );
          const newImageDescriptions = [...vaultData.imageDescriptions];
          if (typeof index === "number") {
            newImageDescriptions.splice(index, 1);
          }
          setVaultData({
            ...vaultData,
            imageUrls: newImageUrls,
            imageDescriptions: newImageDescriptions,
          });
          toast({
            title: "Success",
            description: "Your image has been removed",
          });
        }
      } catch (error) {
        toast({ title: "Error", description: `${error}` });
      }
  };

  const vaultId = pathName.split("/")[pathName.split("/").length - 1];

  return (
    <div className="bg-background">
      {isEditable && otpIsCorrect && (
        <div className="pb-4 pt-9 self-center text-center items-center">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            setCurrentTemplate={setCurrentTemplate}
            vaultId={vaultId}
          />
        </div>
      )}
      {currentTemplate === "Text only" ? (
        <TextOnlyVault
          vaultPassword={vaultPassword!}
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
          setVaultData={setVaultData}
          newContent={newContent}
          setNewContent={setNewContent}
          blockAccess={blockAccess!}
        />
      ) : currentTemplate === "Images" ? (
        <ImgOnlyVault
          vaultPassword={vaultPassword!}
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
          setVaultData={setVaultData}
          blockAccess={blockAccess!}
        />
      ) : (
        <DefaultVault
          vaultPassword={vaultPassword!}
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
          setVaultData={setVaultData}
          newContent={newContent}
          setNewContent={setNewContent}
          blockAccess={blockAccess!}
        />
      )}
    </div>
  );
}
