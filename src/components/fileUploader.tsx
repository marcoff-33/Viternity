"use client";

import React, { useState, useEffect } from "react";
import { server_uploadFile } from "../app/utils/serverActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function FileUploader({
  vaultId,
  onUploadSuccess,
}: {
  vaultId: string;
  onUploadSuccess: (newImageUrl: string) => void;
}) {
  const [file, setFile] = useState<FormData | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [uploading, setUploading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
      setFileUrl(url);
      onUploadSuccess(url);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="self-end text-center items-center font-semibold sm:text-lg relative bg-accent-foreground text-primary max-w-fit sm:pr-10 ">
      <Input
        type="file"
        className="text-transparent absolute flex justify-center items-center text-center"
        onChange={(event) => {
          handleFileChange(event);
        }}
      />
      <p className="absolute inset-0 text-primary -z-50">
        {uploading ? "Uploading..." : "Upload Photo"}
      </p>
      <button onClick={handleUpload} className="w-full text-center ">
        + Upload Photo
      </button>
    </div>
  );
}
