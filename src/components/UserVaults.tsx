import React from "react";
import VaultButton from "./vaultButton";
import Link from "next/link";
import { Button } from "./ui/button";
import DeleteVaultButton from "./deleteVaultButton";

export type Vault = {
  id: string;
  plan: string;
  name: string;
  authorId: string;
  style: string;
  imageUrls: string[];
  vaultText: string;
};

export default function userVaults({ vaults }: { vaults: Vault[] }) {
  function deleteVault(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex sm:flex-row gap-5 flex-col">
      {vaults.map((vault, i) => (
        <div className="" key={i}>
          <VaultButton vaultName={vault.name} vaultId={vault.id} />
          <Link href={`/edit/${vault.id}`}>Edit</Link>
          <DeleteVaultButton vaultId={vault.id} />
        </div>
      ))}
    </div>
  );
}
