import Link from "next/link";
import React from "react";
import { dashboardInputMode } from "./UserVaults";
import { Button } from "./ui/button";
import { server_deleteVault } from "@/app/utils/serverActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";

export default function vaultButton({
  vaultName,
  vaultId,
  currentInputMode,
}: {
  vaultName: string;
  vaultId: string;
  currentInputMode: dashboardInputMode;
}) {
  const borderColor =
    currentInputMode == "Edit"
      ? "border-primary"
      : currentInputMode == "Delete"
      ? "border-destructive"
      : "border-border";
  return (
    <Button className="" asChild variant={"ghost"}>
      {currentInputMode == "Visit" ? (
        <Link
          href={`/${vaultId}`}
          className={`z-50 min-w-[100px] min-h-[50px] rounded-lg border text-center flex justify-center items-center text-foreground bg-card transiton-colors duration-300 ${borderColor}`}
        >
          {vaultName}
        </Link>
      ) : currentInputMode == "Edit" ? (
        <Link
          href={`/edit/${vaultId}`}
          className={`min-w-[100px] min-h-[50px] rounded-lg border text-center flex justify-center items-center text-foreground bg-card transiton-colors duration-300 ${borderColor}`}
        >
          {vaultName}
        </Link>
      ) : (
        <Dialog>
          <DialogTrigger>
            <div
              className={`min-w-[100px] min-h-[50px] rounded-lg border text-center flex justify-center items-center text-foreground bg-card transiton-colors duration-300 text-sm ${borderColor}`}
            >
              {vaultName}
            </div>
          </DialogTrigger>
          <DialogContent
            closeButton={false}
            className="min-w-fit min-h-fit px-10 py-10 items-center text-center"
          >
            <DialogHeader className="text-center items-center text-xl font-semibold border-b pb-2 border-destructive">
              Are you sure you want to delete Vault "{vaultName}" ?
            </DialogHeader>
            <DialogDescription className="">
              This action cannot be undone.
            </DialogDescription>
            <DialogFooter className="flex flex-row gap-5 justify-center md:mt-5">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button
                variant={"destructive"}
                onClick={() => server_deleteVault(vaultId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Button>
  );
}
