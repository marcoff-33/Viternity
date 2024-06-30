import * as React from "react";
import { z } from "zod";
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
import { title } from "process";
import { toast } from "./ui/use-toast";

export default function NewVaultDrawer() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">+</Button>
        </DialogTrigger>
        <DialogContent closeButton={true} className="sm:max-w-[425px] p-5">
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
  const [userPassword, setUserPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const vaultSchema = z
    .object({
      vaultName: z.string(),
      vaultStyle: z.string(),
      userPassword: z
        .string()
        .length(6, "User password must be exactly 6 characters"),
      adminPassword: z
        .string()
        .length(6, "Admin password must be exactly 6 characters"),
      isPrivate: z.boolean(),
    })
    .refine((data) => data.userPassword !== data.adminPassword, {
      message: "User password and admin password must be different",
      path: ["adminPassword"], // This will highlight the adminPassword field if the error is thrown
    });

  const newVault = {
    vaultName,
    vaultStyle,
    userPassword, // must be exactly 6 characters
    adminPassword, // must be exactly 6 characters
    isPrivate,
  };

  const handleInputChange = (
    setState: React.Dispatch<SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  const isValidSchema = vaultSchema.safeParse(newVault);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = vaultSchema.safeParse(newVault);
    if (result.success) {
      try {
        await server_createVault(newVault);
        toast({
          title: "Success!",
          description: "A new vault has been created",
        });
        setOpen(false);
        router.refresh();
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      }
    } else {
      const firstError = result.error.issues[0].message;
      setError(firstError);
      toast({
        title: "Invalid Data",
        description: firstError,
        variant: "destructive",
      });
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
          type="text"
          placeholder="Only visible in your Dashboard"
          onChange={(event) => handleInputChange(setVaultName, event)}
          className=""
          style={{ fontSize: "16px" }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vaultName">Admin Password</Label>
        <Input
          id="vaultName"
          placeholder="Must be exactly 6 numbers"
          onChange={(event) => handleInputChange(setAdminPassword, event)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vaultName">User Password</Label>
        <Input
          id="vaultName"
          placeholder="Must be exactly 6 numbers"
          onChange={(event) => handleInputChange(setUserPassword, event)}
        />
      </div>
      <div className="grid gap-2">
        <Select disabled>
          <Label>Vault Theme </Label>
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
      <Button type="submit">Create Vault</Button>
    </form>
  );
}
