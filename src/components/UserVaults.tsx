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
  vaultPassword: string;
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
          <div className="flex gap-5 my-1">
            <Button asChild>
              <Link href={`/edit/${vault.id}`}>Edit</Link>
            </Button>
            <DeleteVaultButton vaultId={vault.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
