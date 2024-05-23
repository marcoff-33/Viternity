import { ImagesCarousel } from "@/components/ImagesCarousel";

import React from "react";

export default async function page() {
  return (
    <div className="bg-red-50 h-screen flex justify-center py-20">
      <ImagesCarousel />
    </div>
  );
}
