import * as React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { GoDotFill } from "react-icons/go";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { SetStateAction, useEffect, useState } from "react";
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
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { CgDanger } from "react-icons/cg";

export default function NewVaultDrawer() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [showContent, setShowContent] = useState(true);
  const handleNextPage = (page: 1 | 2) => {
    setShowContent(false);
    setCurrentPage(page);
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-accent text-2xl text-center items-center self-center hover:text-primary"
            variant={"outline"}
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent closeButton={true} className="sm:max-w-[425px] p-5">
          <DialogHeader>
            {currentPage === 1 ? (
              <DialogTitle>Style Settings</DialogTitle>
            ) : (
              <DialogTitle>Privacy Settings</DialogTitle>
            )}
            <DialogDescription>
              You can edit any of these settings later.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            open={open}
            setOpen={setOpen}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleNextPage={handleNextPage}
            showContent={showContent}
          />
          <DialogFooter className="pt-2">
            {currentPage === 1 ? (
              <DialogClose asChild>
                <Button variant="outline" className="grow">
                  Cancel
                </Button>
              </DialogClose>
            ) : (
              <Button
                className="grow"
                variant="secondary"
                onClick={() => handleNextPage(1)}
              >
                Back
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="text-primary h text-2xl text-center items-center self-center bg-background hover:bg-card border-border">
          +
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card">
        <DrawerHeader
          className={`transition-opacity duration-800 ${
            showContent === false
              ? "opacity-0 invisible  saturate-0"
              : "opacity-100 saturate-100"
          }`}
        >
          {currentPage === 1 ? (
            <DrawerTitle>Style Settings</DrawerTitle>
          ) : (
            <DrawerTitle>Privacy Settings</DrawerTitle>
          )}
          <DrawerDescription>
            You can edit any of these settings later.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          open={open}
          setOpen={setOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleNextPage={handleNextPage}
          showContent={showContent}
        />
        <DrawerFooter className="pt-2">
          {currentPage === 1 ? (
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          ) : (
            <Button variant="secondary" onClick={() => handleNextPage(1)}>
              Back
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  open,
  setOpen,
  currentPage,
  setCurrentPage,
  handleNextPage,
  showContent,
}: React.ComponentProps<"form"> & {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  currentPage: 1 | 2;
  setCurrentPage: React.Dispatch<SetStateAction<1 | 2>>;
  handleNextPage: (page: 1 | 2) => void;
  showContent: boolean;
}) {
  const [vaultName, setVaultName] = useState("Unnamed Vault");
  const { setTheme, theme } = useTheme();
  const [vaultStyle, setVaultStyle] = useState(theme || "default");
  const [vaultPassword, setVaultPassword] = useState("");
  const [collabPassword, setCollabPassword] = useState("");

  // state for the visibility setting, set to true will require a password to view page
  const [isPrivate, setIsPrivate] = useState(false);

  // state for the editing setting, set to true will require a password to edit page
  const [allowCollab, setAllowCollab] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const vaultSchema = z
    .object({
      vaultName: z.string(),
      vaultStyle: z.string(),
      isPrivate: z.boolean(),
      allowCollab: z.boolean(),
      collabPassword: z.string().optional(),
      vaultPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.isPrivate) {
          return data.vaultPassword && data.vaultPassword.length === 6;
        }
        return true;
      },
      {
        message: "Vault password must be exactly 6 numbers",
        path: ["vaultPassword"],
      }
    )
    .refine(
      (data) => {
        if (data.allowCollab) {
          return data.collabPassword && data.collabPassword.length === 6;
        }
        return true;
      },
      {
        message: "Editing password must be exactly 6 numbers",
        path: ["collabPassword"],
      }
    )
    .refine(
      (data) => {
        if (data.allowCollab && data.isPrivate) {
          return data.collabPassword !== data.vaultPassword;
        }
        return true;
      },
      {
        message: "Editing password must be different from Vault password",
        path: ["collabPassword"],
      }
    );

  const newVault = {
    vaultName,
    vaultStyle,
    vaultPassword, // must be exactly 6 characters
    isPrivate,
    allowCollab,
    collabPassword,
  };

  const handleInputChange = (
    setState: React.Dispatch<SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  useEffect(() => {
    setTheme(vaultStyle);
  }, [vaultStyle]);

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
          variant: "successful",
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
      {currentPage === 1 ? (
        <div
          className={`transition-opacity duration-800 grid items-start gap-4 ${
            showContent === false
              ? "opacity-0 invisible  saturate-0"
              : "opacity-100 saturate-100"
          }`}
        >
          <div className="grid gap-2 border-b border-primary pb-5">
            <Label htmlFor="vaultName">Vault Name</Label>
            <Input
              id="vaultName"
              type="text"
              placeholder="Only visible in your Dashboard"
              onChange={(event) => handleInputChange(setVaultName, event)}
              className="ring-1 ring-muted "
            />
          </div>
          <Select
            onValueChange={(value) => setVaultStyle(value)}
            value={vaultStyle}
          >
            <div className="flex flex-row items-center gap-2">
              <Label>Vault Theme </Label>
              <div
                className="flex flex-row bg-secondary
          max-w-fit rounded-full px-2 transition-colors duration-500"
              >
                <div className="text-primary">
                  <GoDotFill />
                </div>
                <div className="text-background">
                  <GoDotFill />
                </div>
                <div className="text-foreground">
                  <GoDotFill />
                </div>
              </div>
            </div>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Theme" />
            </SelectTrigger>
            <SelectContent className="z-[5000]">
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div
          className={`transition-opacity duration-800 grid items-start gap-4 ${
            showContent === false
              ? "opacity-0 invisible saturate-0"
              : "opacity-100 saturate-100"
          }`}
        >
          <div className="grid gap-2 ">
            <Label htmlFor="vaultPrivacy" className="text-lg">
              Visibility Permissions
            </Label>

            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={isPrivate}
                onCheckedChange={(checked) => {
                  setIsPrivate(checked), setVaultPassword("");
                }}
              />
              <p className="text-muted-foreground">Require Password to View</p>
            </div>
            <p
              className={`text-sm  ${isPrivate ? "text-accent" : "text-muted"}`}
            >
              Anyone trying to view this page will be required to enter this
              password before viewing any of the contents.
            </p>
          </div>
          <div className="grid gap-2 border-b border-primary pb-5">
            <Label
              htmlFor="vaultName"
              className={`${isPrivate ? "text-foreground" : "text-muted"}`}
            >
              Viewing Password
            </Label>
            <Input
              id="vaultName"
              className={`ring-1 ring-muted transition-all duration-200 ${
                !isPrivate
                  ? "placeholder:text-muted"
                  : "placeholder:text-muted-foreground"
              }`}
              value={vaultPassword}
              placeholder="Must be exactly 6 numbers"
              type="number"
              onChange={(event) => handleInputChange(setVaultPassword, event)}
              disabled={!isPrivate}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vaultPrivacy" className="text-lg">
              Editing Permissions {collabPassword}
            </Label>

            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={allowCollab}
                onCheckedChange={(checked) => {
                  setAllowCollab(checked), setCollabPassword("");
                }}
              />
              <p className="text-muted-foreground">
                Allow Anyone to Edit with Password
              </p>
            </div>
            <p
              className={`text-sm  ${
                allowCollab ? "text-accent" : "text-muted"
              }`}
            >
              This will allow anyone with the given password to add, edit, or
              delete content on this page.
            </p>
          </div>
          <div className="grid gap-2 border-b border-primary pb-5">
            <Label
              htmlFor="vaultName"
              className={`${allowCollab ? "text-foreground" : "text-muted"}`}
            >
              Editing Password
            </Label>
            <Input
              id="vaultName"
              className={`ring-1 ring-muted transition-all duration-200 ${
                !allowCollab
                  ? "placeholder:text-muted"
                  : "placeholder:text-muted-foreground"
              }`}
              value={collabPassword}
              placeholder="Must be exactly 6 numbers"
              type="number"
              onChange={(event) => handleInputChange(setCollabPassword, event)}
              disabled={!allowCollab}
            />
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm font-bold">{error}</div>}
      {currentPage === 1 ? (
        <Button
          type="button"
          onClick={() => handleNextPage(2)}
          className=""
          variant={"default"}
          asChild
        >
          <div className=""> Continue</div>
        </Button>
      ) : (
        <Button type="submit">Create Vault </Button>
      )}
    </form>
  );
}
