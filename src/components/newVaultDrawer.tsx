import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetStateAction, useState } from "react";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { server_createVault } from "../app/utils/serverActions";
import { useRouter } from "next/navigation";

export default function newVaultDrawer() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">+</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-5">
          <DialogHeader>
            <DialogTitle>Set up a new Vault</DialogTitle>
            <DialogDescription>
              You can edit any of these settings later.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm open={open} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">+</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Set up a new Vault</DrawerTitle>
          <DrawerDescription>
            You can edit any of these settings later.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" open={open} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  open,
  setOpen,
}: React.ComponentProps<"form"> & {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [vaultName, setVaultName] = useState("Unnamed Vault");
  const [vaultStyle, setVaultStyle] = useState("default");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const newVault = { vaultName, vaultStyle };
  const handleInputChange = (
    setState: React.Dispatch<SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await server_createVault(newVault);
      setOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="vaultName">Vault Name</Label>
        <Input
          id="vaultName"
          placeholder="Only visible in your Dashboard"
          onChange={(event) => handleInputChange(setVaultName, event)}
        />
      </div>
      <div className="grid gap-2">
        <Select disabled>
          <Label>Vault Theme</Label>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">placeholder</SelectItem>
              <SelectItem value="banana">placeholder</SelectItem>
              <SelectItem value="blueberry">placeholder</SelectItem>
              <SelectItem value="grapes">placeholder</SelectItem>
              <SelectItem value="pineapple">placeholder</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-red-500 text-sm font-bold">{error}</div>}
      <Button type="submit" disabled={error !== null}>
        Create Vault
      </Button>
    </form>
  );
}
