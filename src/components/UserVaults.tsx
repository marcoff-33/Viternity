"use client";

import React, { useEffect, useState } from "react";
import VaultButton from "./vaultButton";
import { Button } from "./ui/button";
import { useAnimation } from "framer-motion";
import { input } from "zod";

export type Vault = {
  id: string;
  plan: string;
  name: string;
  authorId: string;
  style: string;
  imageUrls: string[];
  vaultText: string;
  vaultPassword: string;
  vaultTitle: string;
};

export type dashboardInputMode = "Edit" | "Delete" | "Visit";

export default function UserVaults({ vaults }: { vaults: Vault[] }) {
  const [inputMode, setInputMode] = useState<dashboardInputMode>("Visit");
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <div
        className={`min-w-full items-center flex justify-around bg-background border-b border-border pb-5 transition-colors duration-500 ${
          inputMode === "Delete" ? "border-destructive" : "border-border"
        } ${inputMode === "Edit" ? "border-primary" : "border-border"}`}
      >
        <InputButton
          buttonType={"Delete"}
          currentInputMode={inputMode}
          setInputMode={setInputMode}
          isCurrentlyAnimating={isAnimating}
          setIscurentlyAnimating={setIsAnimating}
        />
        <InputButton
          buttonType={"Visit"}
          currentInputMode={inputMode}
          setInputMode={setInputMode}
          isCurrentlyAnimating={isAnimating}
          setIscurentlyAnimating={setIsAnimating}
        />
        <InputButton
          buttonType={"Edit"}
          currentInputMode={inputMode}
          setInputMode={setInputMode}
          isCurrentlyAnimating={isAnimating}
          setIscurentlyAnimating={setIsAnimating}
        />
      </div>
      <div className="text-4xl gap-3 text-foreground flex w-[80vw] justify-center flex-col ">
        <div className={`basis-1/2 self-center items-start text-end relative`}>
          <div
            className={`transition-all duration-500 ${
              inputMode === "Delete" ? "text-destructive" : "text-foreground"
            } ${isAnimating ? "opacity-0" : "opacity-100"} `}
          >
            {inputMode}
          </div>
        </div>
        <p
          className={`basis-1/2 text-center  transition-colors duration-500 ${
            inputMode === "Delete" ? "text-destructive" : "text-foreground"
          }`}
        >
          Your Vaults.
        </p>
      </div>
      <div className="flex sm:flex-row gap-5 flex-col">
        {vaults.map((vault, i) => (
          <VaultButton
            vaultName={vault.name}
            vaultId={vault.id}
            currentInputMode={inputMode}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export function InputButton({
  buttonType,
  currentInputMode,
  setInputMode,
  isCurrentlyAnimating,
  setIscurentlyAnimating,
}: {
  buttonType: dashboardInputMode;
  currentInputMode: dashboardInputMode;
  setInputMode: React.Dispatch<React.SetStateAction<dashboardInputMode>>;
  isCurrentlyAnimating: boolean;
  setIscurentlyAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleNewInputMode = () => {
    setIscurentlyAnimating(true);
    setTimeout(() => {
      setIscurentlyAnimating(false);
      setInputMode(buttonType);
    }, 50);
  };
  const buttonBackgroundColor =
    buttonType == "Delete"
      ? "bg-destructive"
      : buttonType == "Edit"
      ? "bg-primary"
      : "bg-card";
  const textColor =
    buttonType == "Edit"
      ? "text-primary-foreground"
      : buttonType == "Delete"
      ? "text-destructive-foreground"
      : "text-foreground";
  const borderColor =
    buttonType == "Edit"
      ? "border-primary"
      : buttonType == "Delete"
      ? "border-destructive"
      : "border-border";

  return (
    <button
      onClick={() => handleNewInputMode()}
      disabled={currentInputMode == buttonType}
      className={`${
        buttonType == currentInputMode && !isCurrentlyAnimating
          ? `${textColor} ${buttonBackgroundColor}`
          : `bg-transparent text-primary `
      } rounded-none first:rounded-l-md last:rounded-r-md border py-1 px-1 lg:font-semibold lg:text-xl font-semibold text-sm grow transition-all duration-300`}
    >
      {buttonType}
    </button>
  );
}
