import UserVaults from "@/components/UserVaults";
import CreateVault from "@/components/createVault";
import {
  server_getUserVaults,
  server_handleUser,
} from "@/components/server_getUser";

import { auth } from "@clerk/nextjs/server";
import React, { useEffect, useState } from "react";

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
