import React from "react";
import VaultButton from "./vaultButton";

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
  return (
    <div className="flex sm:flex-row gap-5 flex-col">
      {vaults.map((vault, i) => (
        <div className="" key={i}>
          <VaultButton vaultName={vault.name} vaultId={vault.id} />
        </div>
      ))}
    </div>
  );
}
