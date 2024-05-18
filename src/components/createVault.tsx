"use client";

import React, { useEffect, useState } from "react";
import NewVaultDrawer from "./newVaultDrawer";
import { server_handleUser } from "./server_getUser";

export default function CreateVault({
  handleCreateVault,
}: {
  handleCreateVault: void;
}) {
  return (
    <div className="">
      <NewVaultDrawer />
    </div>
  );
}
