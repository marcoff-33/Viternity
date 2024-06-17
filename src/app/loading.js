import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex justify-center min-h-screen flex-col container relative items-center">
      <div className="text-black text-5xl animate-spin">
        <FaSpinner className="text-white animate-spin" />
      </div>
    </div>
  );
}
