"use client";

import * as React from "react";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePathname } from "next/navigation";
import {
  server_deleteFile,
  server_formatImageUrl,
  server_getVaultData,
} from "../app/utils/serverActions";
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { RxDotFilled } from "react-icons/rx";
import { IoIosPhotos } from "react-icons/io";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FaTrashAlt } from "react-icons/fa";
import { revalidatePath } from "next/cache";
import { Router } from "next/router";
import Images from "./Image";

export function ImagesCarousel({
  vaultImages,
  vaultId,
  onImageDelete,
  isEditable,
  isDecorative,
  isDisabled,
}: {
  vaultImages: string[];
  vaultId: string;
  onImageDelete?: (
    imageUrl: string,
    action: "add" | "remove",
    index: number
  ) => void;
  isEditable: boolean;
  isDecorative?: boolean;
  isDisabled?: boolean;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [vaultImages, api]);

  const handleDelete = async (imageUrl: string, index: number) => {
    const dbUrl = await server_formatImageUrl(imageUrl, "from cdn to storage");
    setIsProcessing(true);
    await server_deleteFile(dbUrl, vaultId, index);
    api?.scrollPrev();
    setIsProcessing(false);
    setTimeout(() => {
      onImageDelete!(imageUrl, "remove", index);
    }, 800);
  };

  return (
    <Dialog>
      <DialogTrigger
        className="rounded-lg max-h-fit self-center outline-none"
        disabled={vaultImages.length == 0 || isDisabled}
      >
        <div className="w-[300px] rounded-lg">
          <AspectRatio
            ratio={5 / 4}
            className="relative outline-none rounded-3xl shadow-md shadow-black"
          >
            {vaultImages && !isDecorative && vaultImages.length > 0 ? (
              <>
                <IoIosPhotos
                  className="absolute z-50 text-white top-2 right-2"
                  size={30}
                />
                <img
                  src={vaultImages![0]}
                  alt=""
                  className="rounded-3xl object-cover object-center absolute h-full w-full bg-gradient-to-b from-background to-primary" //
                />
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center rounded-3xl bg-gradient-to-b from-background to-primary/50 border border-border"></div>
            )}
          </AspectRatio>
          <div className="flex flex-row justify-center py-2">
            {vaultImages && vaultImages.length > 0 && (
              <div className="flex flex-row justify-center">
                {vaultImages.map((dot, index) => (
                  <RxDotFilled
                    className={`${
                      index == 0 ? "text-xl" : "text-sm"
                    } items-center self-center text-accent`}
                    key={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        closeButton={true}
        className=" z-[5000] min-w-[95vw] max-h-[95vh] max-w-4xl border-none flex justify-center flex-col shadow-none"
      >
        <Carousel className="max-w-[80vw] self-center" setApi={setApi}>
          <CarouselContent className="">
            {vaultImages?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex justify-center items-center">
                  <CardContent className=" min-h-[95vh] w-full  items-center flex justify-center rounded-lg ">
                    <div className="relative">
                      <Images cdnUrl={image} isProcessing={isProcessing} />
                      {isEditable && (
                        <div
                          className="cursor-pointer absolute bottom-5 right-5 py-4 px-8 bg-accent-foreground/80 backdrop-blur-md text-destructive rounded-full"
                          onClick={() => handleDelete(image, index)}
                          key={index}
                        >
                          <FaTrashAlt />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="w-[50px] h-[40px] inline-flex bg-card ring-1 ring-ring" />
          <CarouselNext className="w-[50px] h-[40px] inline-flex  bg-card ring-1 ring-ring" />
        </Carousel>
        <div className="flex flex-row justify-center  absolute bottom-0 left-0 right-0">
          {vaultImages && vaultImages.length > 0 && (
            <div className="flex flex-row justify-center items-center">
              {vaultImages.map((dot, index) => (
                <RxDotFilled
                  className={`${
                    index == current - 1 ? "text-xl" : "text-sm"
                  } items-center self-center text-primary transition-all duration-200`}
                  key={index}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
