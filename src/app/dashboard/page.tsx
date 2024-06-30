import UserVaults from "@/components/UserVaults";
import CreateVault from "@/components/createVault";
import React from "react";
import { server_getUserVaults } from "../utils/serverActions";

export default async function page() {
  const userVaults = await server_getUserVaults();

  return (
    <div className="min-h-screen bg-background flex justify-center items-center flex-col gap-5 text-foreground">
      <UserVaults vaults={userVaults} />
      <CreateVault />
    </div>
  );
}
