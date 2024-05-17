"use client";

import React, { useState } from "react";
import NewVaultDrawer from "./newVaultDrawer";

export default function CreateVault({
  handleCreateVault,
}: {
  handleCreateVault: void;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="">
      <NewVaultDrawer />
    </div>
  );
}
