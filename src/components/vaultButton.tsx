import Link from "next/link";
import React from "react";

export default function vaultButton({
  vaultName,
  vaultId,
}: {
  vaultName: string;
  vaultId: string;
}) {
  return (
    <Link
      href={`/${vaultId}`}
      className="min-w-[100px] min-h-[50px] rounded-lg border border-primary text-center flex justify-center items-center text-primary-foreground hover:bg-primary/5 transiton-colors duration-100"
    >
      {vaultName}
    </Link>
  );
}
