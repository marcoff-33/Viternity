"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Vault } from "./UserVaults";
import { server_getVaultData } from "@/app/utils/serverActions";
import { ImagesCarousel } from "./ImagesCarousel";

export default function VaultEditor({ userId }: { userId: string }) {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
  };

  useEffect(() => {
    handleFirstLoad();
    console.log("loaded", vaultData, vaultId);
  }, []);

  const vaultOwnership = vaultData?.authorId == userId;

  const pathName = usePathname();
  const vaultId = pathName.split("/")[2];
  return (
    <div className="">
      {vaultOwnership ? (
        <div className="">
          <ImagesCarousel vaultImages={vaultData.imageUrls} />
        </div>
      ) : (
        <div className="">You are not allowed to edit this Vault.</div>
      )}
    </div>
  );
}
