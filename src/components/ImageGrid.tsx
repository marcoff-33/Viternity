import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";

export default function ImageGrid({ imageUrls }: { imageUrls: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 items-center">
      {imageUrls.map((url, index) => (
        <div
          className={`self-start flex justify-center flex-col ${
            index % 2 === 0 ? "col-2" : "col-1"
          }`}
        >
          <img
            key={index}
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full object-cover max-w-fit self-center grow rounded-md min-h-full min-w-full"
          />
          <div className="self-center">
            TesKDJS kasj dhkasjd ASLJD SAKjdAKSj dkasjd ak; djaskdj alkdj alksjd
            lkasdjakl djaks jdak djsak djask djskaj dkst
          </div>
        </div>
      ))}
    </div>
  );
}
