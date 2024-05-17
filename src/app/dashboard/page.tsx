import CreateVault from "@/components/createVault";
import PicturesArea from "@/components/picturesArea";
import { server_handleUser } from "@/components/server_getUser";
import UploadArea from "@/components/uploadArea";
import { SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";

export default function page() {
  const { userId } = auth();
  const handleCreateVault = console.log("proot");

  return (
    <div className="min-h-screen bg-accent-foreground flex justify-center items-center flex-col gap-5">
      <div className="text-primary-foreground text-5xl">Your Vaults.</div>
      <CreateVault handleCreateVault={handleCreateVault} />
    </div>
  );
}
