"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function QrCodeModal() {
  const pathName = usePathname();
  const vaultId = pathName.split("/")[pathName.split("/").length - 1];

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="sticky font-semibold text-accent z-50 cursor-pointer"
      >
        <div>QR Code</div>
      </DialogTrigger>
      <DialogContent closeButton={true}>
        <DialogHeader>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${`https://viternity.vercel.app/`}/${vaultId}`}
            className="p-2 border-b w-[350px] h-[350px] items-center self-center"
          />
          <DialogDescription className="p-2">
            To save your QR Code locally, Right Click on the image then select
            "Save as...".
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
