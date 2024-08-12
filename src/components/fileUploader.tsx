"use client";

import React, { useState, useEffect } from "react";
import {
  server_formatImageUrl,
  server_uploadFile,
} from "../app/utils/serverActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AiOutlinePicture } from "react-icons/ai";
import { toast } from "./ui/use-toast";
import { calculateMegapixels } from "@/app/utils/checkMpCount";

export default function FileUploader({
  vaultId,
  onUploadSuccess,
}: {
  vaultId: string;
  onUploadSuccess: (newImageUrl: string, action: "add" | "remove") => void;
}) {
  const [file, setFile] = useState<FormData | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const megapixels = await calculateMegapixels(file);
      if (megapixels > 20) {
        toast({
          title: "Error",
          description: `Image size exceeds megapixel limit (20MP)`,
          variant: "destructive",
          duration: 10000,
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      setFile(formData);
    }
  };

  const handleUpload = async () => {
    if (!file) console.log("nofile");
    setUploading(true);

    try {
      const url = await server_uploadFile(file!, vaultId);
      if (url) {
        setFileUrl(url);
        onUploadSuccess(url, "add");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="self-center flex justify-center text-center items-center font-semibold sm:text-lg relative  text-accent">
      <Input
        type="file"
        id="file"
        name="file"
        className="z-[5000] shadow-none cursor-pointer text-transparent file:hidden absolute flex justify-center items-center text-center max-w-full"
        onChange={(event) => {
          handleFileChange(event);
        }}
        disabled={uploading}
      />

      <div className="w-full text-center self-center items-center ">
        {uploading ? "Uploadin..." : "Upload Photo"}
      </div>
    </div>
  );
}
