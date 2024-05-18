import React from "react";
import VaultButton from "./vaultButton";

export type Vault = {
  plan: string;
};

export default function userVaults({ vaults }: { vaults: Vault[] }) {
  return (
    <div className="flex sm:flex-row gap-5 flex-col">
      {vaults.map((vault, i) => (
        <div className="" key={i}>
          <VaultButton vaultName={vault.plan} />
        </div>
      ))}
    </div>
  );
}
