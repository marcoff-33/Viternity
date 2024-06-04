import React from "react";

export default function Navbar() {
  return (
    <div className="container flex justify-between items-center">
      <div className="flex gap-5">
        <a href="/">Home</a>
        <a href="/">Dashboard</a>
      </div>
    </div>
  );
}
