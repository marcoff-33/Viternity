import React from "react";
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
  const templateOptions: vaultTemplate[] = ["Default", "Text only", "Images"];
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await server_updateVaultTemplate(vaultId, currentTemplate);
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
  return (
    <Dialog>
      <DialogTrigger className="text-primary text-xl">
        Advanced Options
      </DialogTrigger>
      <DialogContent closeButton={false}>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            defaultValue={currentTemplate}
            onValueChange={(value: vaultTemplate) => setCurrentTemplate(value)}
          >
            {templateOptions.map((template, i) => (
              <RadioItem value={template} id={`option-${i}`} key={i} />
            ))}
          </RadioGroup>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const RadioItem = ({ value, id }: { value: string; id: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id}>{value}</Label>
    </div>
  );
};
