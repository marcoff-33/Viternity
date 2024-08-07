import UserVaults from "@/components/UserVaults";
import CreateVault from "@/components/createVault";
import React from "react";
import { server_getUserVaults } from "../utils/serverActions";
import { auth } from "../utils/auth";
import { SignIn } from "@/components/SignIn";

export default async function page() {
  const session = await auth();
  const userVaults = session ? await server_getUserVaults() : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background flex justify-center items-center flex-col gap-5 text-foreground">
      {session && userVaults ? (
        <>
          <UserVaults vaults={userVaults} />
          <CreateVault />{" "}
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
