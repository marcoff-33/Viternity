import React, { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export default function Example({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-2 flex-row border border-border bg-card rounded-md justify-aroun px-3 py-2 shadow-md shadow-shadow">
      <div className="self-center text-accent">{icon}</div>
      <div className="grow">
        <div className="">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
