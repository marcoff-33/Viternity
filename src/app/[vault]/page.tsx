"use client";

import {
  server_getUserVaults,
  server_getVaultData,
} from "@/components/server_getUser";
import React from "react";

export default function page() {
  return (
    <div>
      <button onClick={() => server_getVaultData("plswork")}>GetData</button>
    </div>
  );
}
