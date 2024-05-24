import { ImagesCarousel } from "@/components/ImagesCarousel";
import Tiptap from "@/components/TipTap";

import React from "react";

export default async function page() {
  return (
    <div className="bg-red-50 flex justify-center h-screen flex-col container">
      <div className="items-center max-h-fit flex justify-center">
        <ImagesCarousel />
      </div>
      <div className="border border-red-500 ">
        <Tiptap />
      </div>
    </div>
  );
}
