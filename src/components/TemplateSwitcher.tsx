import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { vaultTemplate } from "./UserVaults";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { server_updateVaultTemplate } from "@/app/utils/serverActions";

export default function TemplateSwitcher({
  currentTemplate,
  setCurrentTemplate,
  vaultId,
}: {
  currentTemplate: vaultTemplate;
  setCurrentTemplate: React.Dispatch<React.SetStateAction<vaultTemplate>>;
  vaultId: string;
}) {
  const [allowSave, setAllowSave] = useState(false);
  const [originalTemplate, setOriginalTemplate] = useState(currentTemplate);
  const templateOptions: vaultTemplate[] = ["Default", "Text only", "Images"];
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await server_updateVaultTemplate(vaultId, currentTemplate);
      setOriginalTemplate(currentTemplate);
      setAllowSave(false);
      toast({
        title: "Success",
        description: "Template updated successfully",
        variant: "successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Template",
        variant: "destructive",
      });
    }
  };
  const handleValueChange = (value: vaultTemplate) => {
    setCurrentTemplate(value);
  };
  return (
    <Dialog>
      <DialogTrigger className="text-accent text-xl">
        Advanced Options
      </DialogTrigger>
      <DialogContent closeButton={false} className="p-5 flex justify-center ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="">Select a template</div>
          <RadioGroup
            defaultValue={currentTemplate}
            onValueChange={(value: vaultTemplate) => handleValueChange(value)}
            className=""
          >
            {templateOptions.map((template, i) => (
              <RadioItem value={template} id={`option-${i}`} key={i} />
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button
              type="submit"
              disabled={originalTemplate === currentTemplate}
              className={` ${
                originalTemplate === currentTemplate
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary"
              }`}
            >
              Save Template
            </Button>
            <DialogClose className="flex flex-row gap-2 items-center">
              <Button type="button" variant={"secondary"}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const RadioItem = ({ value, id }: { value: string; id: string }) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <RadioGroupItem value={value} id={id} className="h-5 w-5" />
      <Label htmlFor={id}>{value}</Label>
    </div>
  );
};
