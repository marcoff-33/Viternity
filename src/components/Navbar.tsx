import React from "react";

export default function Navbar() {
  return (
    <div className="container flex justify-between items-center absolute z-50">
      <div className="text-white flex gap-5">
        <a href="/">Home</a>
        <a href="/">Dashboard</a>
      </div>
    </div>
  );
}
