import UserVaults from "@/components/UserVaults";
import CreateVault from "@/components/createVault";
import React from "react";
import { server_getUserVaults } from "../utils/serverActions";

export default async function page() {
  const userVaults = await server_getUserVaults();

  return (
    <div className="min-h-screen bg-accent-foreground flex justify-center items-center flex-col gap-5">
      <div className="text-primary-foreground text-5xl">Your Vaults.</div>
      <UserVaults vaults={userVaults} />
      <CreateVault />
    </div>
  );
}
