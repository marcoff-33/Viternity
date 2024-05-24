import { ImagesCarousel } from "@/components/ImagesCarousel";

import React from "react";

export default async function page() {
  return (
    <div className="bg-red-50 flex justify-center h-screen">
      <div className="items-center max-h-fit flex justify-center">
        <ImagesCarousel />
      </div>
    </div>
  );
}
