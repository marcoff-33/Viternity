import React, { SetStateAction, useState } from "react";
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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { server_createVault } from "./server_getUser";

export default function NewVaultDrawer() {
  const [vaultName, setVaultName] = useState("");
  const [vaultStyle, setVaultStyle] = useState("default");

  const newVault = { vaultName, vaultStyle };

  const handleInputChange = ({
    setState,
    event,
  }: {
    setState: React.Dispatch<SetStateAction<string>>;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => {
    setState(event.target.value);
  };

  return (
    <Drawer>
      <DrawerTrigger className="z-50 text-lg bg-red-500 p-10 rounded-xl">
        +
      </DrawerTrigger>
      <DrawerContent className="pt-2 pb-10">
        <DrawerHeader>
          <DrawerTitle className="text-center">Create New Vault</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <Input
            placeholder="Vault Name"
            onChange={(event) =>
              handleInputChange({ setState: setVaultName, event })
            }
          />
        </div>
        <div className="px-5 py-5">
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Default Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DrawerFooter>
          <Button className="" onClick={() => server_createVault(newVault)}>
            Submit
          </Button>
          <DrawerClose className="py-2">
            <Button variant={"outline"} className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
