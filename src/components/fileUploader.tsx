"use client";

import React, { useState } from "react";
import { server_uploadFile } from "../app/utils/serverActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export default function FileUploader({ vaultId }: { vaultId: string }) {
  const [file, setFile] = useState<FormData | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [uploading, setUploading] = useState(false);
  const pathName = usePathname();
  console.log(pathName);

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
    console.log("tryubg");
    try {
      const url = await server_uploadFile(file!, vaultId);
      setFileUrl(url);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button
        disabled={uploading || !file}
        variant={"default"}
        onClick={handleUpload}
      >
        {uploading ? "Uploading ..." : "Upload"}
      </Button>
      {error && <p>{error}</p>}
      {fileUrl && (
        <p>
          File uploaded: <a href={fileUrl}>{fileUrl}</a>
        </p>
      )}
    </div>
  );
}
