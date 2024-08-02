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

export default function TextOnlyVault({
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
  newContent,
  setNewContent,
}: {
  otpIsCorrect: boolean;
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
  newContent: string | undefined;
  setNewContent: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <>
      {otpIsCorrect ? (
        <div className="flex justify-start flex-col w-full relative">
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
            <div className="self-center items-center flex justify-start  flex-col gap-2 w-full">
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
          <div className="relative py-10 flex flex-col justify-center items-center gap-5 w-full h-full">
            {loadEditor && (
              <TextEditor
                editable={isEditable}
                vaultText={vaultText!}
                vaultId={vaultId}
                newContent={newContent}
                setNewContent={setNewContent}
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
    </>
  );
}
