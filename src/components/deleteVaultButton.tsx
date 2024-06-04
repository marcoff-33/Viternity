"use client";

import { server_deleteVault } from "@/app/utils/serverActions";
import { Button } from "./ui/button";

export default function deleteVaultButton({ vaultId }: { vaultId: string }) {
  return (
    <Button variant={"destructive"} onClick={() => server_deleteVault(vaultId)}>
      Delete
    </Button>
  );
}
