"use client";

import React, { useEffect, useState } from "react";
import { server_handleUser } from "./server_getUser";
import NewVaultDrawer from "./newVaultDrawer";

export default function CreateVault({}: {}) {
  return (
    <div className="">
      <NewVaultDrawer />
    </div>
  );
}
