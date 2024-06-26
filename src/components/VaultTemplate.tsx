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

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
    setVaultTitle(data.vaultTitle);
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
    <div className="py-20 ">
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
              className="self-end lg:pr-20 text-center items-center font-semibold sm:text-lg relative bg-transparent text-primary max-w-fit "
            >
              Edit
            </Link>
          )}
          {vaultData && (
            <div className="self-center items-center flex justify-center flex-col gap-2 w-full">
              <ImagesCarousel
                vaultImages={vaultData!.imageUrls}
                vaultId={vaultId}
                onImageDelete={handleNewImage}
                isEditable={isEditable}
              />

              <div className="text-center items-center text-4xl font-medium px-10 pb-10 pt-5 border-b border-border flex flex-col min-w-full justify-center gap-5">
                {!isEditable ? (
                  <div className="text-foreground">{vaultData.vaultTitle}</div>
                ) : (
                  <div className="">
                    {!showTitleEditor ? (
                      <div
                        className="text-foreground flex flex-col lg:flex-row justify-center items-center gap-5"
                        onClick={() => setShowTitleEditor(true)}
                      >
                        {vaultData.vaultTitle}
                        <div className="text-sm font-light text-foreground">
                          <CiEdit size={30} />
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateTitle}>
                        <Input
                          placeholder="Add a new Name / Title"
                          className="text-2xl border-muted border"
                          onChange={(e) => setVaultTitle(e.target.value)}
                          autoFocus
                        />
                        <div className="flex flex-row justify-center gap-2 p-2">
                          <div
                            className="text-sm font-light flex justify-center items-center border border-border rounded-lg py-2 px-5"
                            onClick={() => setShowTitleEditor(false)}
                          >
                            <p>Cancel</p>
                          </div>
                          <Button className="" type="submit" id="submit">
                            Save
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="relative py-10 flex flex-col justify-center items-center gap-5 w-full">
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
