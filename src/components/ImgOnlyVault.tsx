import React, { useEffect, useState } from "react";
import { Vault } from "./UserVaults";
import QrCodeModal from "./QrCodeModal";
import FileUploader from "./fileUploader";
import Link from "next/link";
import { ImagesCarousel } from "./ImagesCarousel";
import { CiEdit } from "react-icons/ci";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import TextEditor from "./TipTap";
import OtpInput from "./OtpInput";

import { AspectRatio } from "./ui/aspect-ratio";
import {
  server_addDescriptionToImage,
  server_deleteFile,
  server_formatImageUrl,
} from "@/app/utils/serverActions";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { set, z } from "zod";
import { clearPreviewData } from "next/dist/server/api-utils";

export default function ImageOnlyVault({
  otpIsCorrect,
  isEditable,
  vaultData,
  vaultId,
  handleNewImage,
  handleUpdateTitle,
  setOtpIsCorrect,
  setShowTitleEditor,
  showTitleEditor,
  loadEditor,
  vaultText,
  setVaultTitle,
  setVaultData,
  vaultPassword,
  blockAccess,
}: {
  otpIsCorrect: boolean | undefined;
  isEditable: boolean;
  vaultData: Vault | undefined;
  vaultId: string;
  handleNewImage: (
    newImageUrl: string,
    action: "add" | "remove"
  ) => Promise<void>;
  handleUpdateTitle: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setOtpIsCorrect: (otpIsCorrect: boolean) => void;
  setShowTitleEditor: (showTitleEditor: boolean) => void;
  showTitleEditor: boolean;
  loadEditor: boolean;
  vaultText: string | undefined;
  setVaultTitle: (vaultTitle: string) => void;
  setVaultData: React.Dispatch<React.SetStateAction<Vault | undefined>>;
  vaultPassword: string;
  blockAccess: boolean | undefined;
}) {
  return (
    <>
      {otpIsCorrect && otpIsCorrect !== undefined ? (
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
          <div className="h-screen mt-5">
            <ImageGrid
              imageUrls={vaultData!.imageUrls}
              imageDescriptions={vaultData!.imageDescriptions}
              setVaultData={setVaultData}
              vaultId={vaultId}
              handleNewImage={handleNewImage}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {vaultData && (
            <OtpInput
              vaultPassword={vaultPassword}
              setOtpIsCorrect={setOtpIsCorrect}
              blockAccess={blockAccess!}
            />
          )}
        </div>
      )}
    </>
  );
}

// grid that displays each image with a description
function ImageGrid({
  imageUrls,
  imageDescriptions,
  setVaultData,
  vaultId,
  handleNewImage,
}: {
  imageUrls: string[];
  imageDescriptions: string[];
  setVaultData: React.Dispatch<React.SetStateAction<Vault | undefined>>;
  vaultId: string;
  handleNewImage: (
    newImageUrl: string,
    action: "add" | "remove",
    index: number
  ) => Promise<void>;
}) {
  const [currentImageDescriptions, setCurrentImageDescriptions] =
    useState<string[]>(imageDescriptions);

  const handleDelete = async (imageUrl: string, index: number) => {
    try {
      const dbUrl = await server_formatImageUrl(
        imageUrl,
        "from cdn to storage"
      );
      await server_deleteFile(dbUrl, vaultId, index);
      handleNewImage(imageUrl, "remove", index);
      const newImageUrls = [...imageUrls.splice(index, 1)];
      const newImageDescriptions = [...imageDescriptions.splice(index, 1)];
      setVaultData((prevData) => {
        if (!prevData) {
          console.error("Vault data is undefined");
          return prevData;
        }
        return {
          ...prevData,
          imageUrls: newImageUrls,
          imageDescriptions: newImageDescriptions,
        };
      });
      toast({
        title: "Success",
        description: "Image deleted successfully",
        variant: "successful",
      });
    } catch (error) {
      toast({
        title: "Failed to delete image",
        description: "Please try again or refresh the page",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 items-center">
      {imageUrls.map((url, index) => (
        <div
          key={index}
          className={`self-start flex justify-center flex-col pb-14 ${
            index % 2 === 0 ? "col-2" : "col-1"
          }`}
        >
          <img
            key={index}
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full object-cover max-w-fit self-center grow rounded-md min-h-full min-w-full"
          />
          <div className="cursor-pointer pt-2">
            <ImageDescription
              description={imageDescriptions[index]}
              index={index}
              setVaultData={setVaultData}
              key={index}
              vaultId={vaultId}
              handleDelete={handleDelete}
              imageUrl={url}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageDescription({
  description,
  index,
  setVaultData,
  vaultId,
  handleDelete,
  imageUrl,
}: {
  description: string;
  index: number;
  setVaultData: React.Dispatch<React.SetStateAction<Vault | undefined>>;
  vaultId: string;
  handleDelete: (imageUrl: string, index: number) => Promise<void>;
  imageUrl: string;
}) {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  // this is to keep track of the last updated descrption in case of input cancel, to avoid mutating original data.
  const [previousDescription, setPreviousDescription] =
    useState<string>(description);

  const [newDescription, setNewDescription] = useState<string>(description);

  const inputSchema = z.string().max(255);

  const handleCancel = () => {
    setIsEditable(false);
    setNewDescription(previousDescription);
  };

  const handleUpdateDescription = async () => {
    const isValidInput = inputSchema.safeParse(newDescription);
    if (!isValidInput.success) {
      toast({
        title: "Error",
        description: "Descprition must be less than 255 characters",
        variant: "destructive",
      });
      return;
    }
    if (description === newDescription) {
      toast({
        title: "No change",
        description: "The title is the same, no update needed.",
        variant: "destructive",
      });
      return;
    }
    try {
      await server_addDescriptionToImage(vaultId, newDescription, index);
      setVaultData((prevData) => {
        if (!prevData) {
          console.error("Vault data is undefined");
          return prevData;
        }

        const newImageDescriptions = [...prevData.imageDescriptions];
        newImageDescriptions[index] = newDescription;

        return {
          ...prevData,
          imageDescriptions: newImageDescriptions,
        };
      });
      setPreviousDescription(newDescription);
      setIsEditable(false);
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

  return (
    <>
      {isEditable ? (
        <form action={handleUpdateDescription}>
          <Textarea
            placeholder="Add a new description"
            className="text-2xl border-muted border"
            autoFocus
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            inputMode="text"
          />
          <div className="flex flex-col justify-center gap-2 p-2">
            <div className="self-center text-muted-foreground">
              {newDescription.length}/255
            </div>
            <Button className="" type="submit" id="submit">
              Save
            </Button>
            <div
              className="text-sm font-light flex justify-center items-center border border-border rounded-lg py-2 px-5"
              onClick={() => handleCancel()}
            >
              <p>Cancel</p>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div
            onClick={() => setIsEditable(true)}
            className="text-xl pt-2 whitespace-pre-line"
          >
            {newDescription}
          </div>
          <Button
            variant={"destructive"}
            onClick={() => handleDelete(imageUrl, index)}
          >
            Delete
          </Button>
        </>
      )}
    </>
  );
}
