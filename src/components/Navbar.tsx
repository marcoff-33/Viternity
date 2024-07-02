import React from "react";
import { ThemeToggle } from "./themeToggle";

export default function Navbar() {
  return (
    <div className="container flex justify-between items-center absolute z-50">
      <div className="text-white flex gap-5 py-2">
        <a href="/" className="text-4xl font-bold text-foreground">
          Viternity
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
