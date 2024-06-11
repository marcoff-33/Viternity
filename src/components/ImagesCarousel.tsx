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
import { server_getVaultData } from "../app/utils/serverActions";
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { RxDotFilled } from "react-icons/rx";
import { IoIosPhotos } from "react-icons/io";
import { Vault } from "./UserVaults";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function ImagesCarousel({ vaultImages }: { vaultImages: string[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [vaultImages, api]);

  return (
    <Dialog>
      <DialogTrigger
        className="max-h-fit self-center outline-none"
        disabled={vaultImages.length == 0}
      >
        <div className="w-[300px] rounded-lg">
          <AspectRatio
            ratio={5 / 4}
            className="border rounded-lg relative bg-primary/50"
          >
            {vaultImages && (
              <>
                <IoIosPhotos
                  className="absolute z-50 text-white top-2 right-2"
                  size={30}
                />
                <img
                  src={vaultImages![0]}
                  alt=""
                  className="object-cover object-center absolute h-full w-full rounded-lg bg-muted-foreground"
                />
              </>
            )}
          </AspectRatio>
          <div className="flex flex-row justify-center">
            {vaultImages && vaultImages.length > 0 && (
              <div className="flex flex-row justify-center">
                {vaultImages.map((dot, index) => (
                  <RxDotFilled
                    className={`${
                      index == 0 ? "text-xl" : "text-sm"
                    } items-center self-center text-primary`}
                    key={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[95vw] max-h-[95vh] max-w-4xl border-none flex justify-center flex-col shadow-none bg-transparent backdrop-blur-md">
        <Carousel className=" max-w-[80vw] self-center" setApi={setApi}>
          <CarouselContent className="items-center">
            {vaultImages?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex justify-center items-center ">
                  <CardContent className="min-h-[95vh] max-w-fit  items-center flex justify-center rounded-lg ">
                    <img
                      src={image}
                      alt=""
                      className="object-contain max-h-[85vh] aspect-auto rounded-lg"
                    />
                  </CardContent>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="w-[50px] h-[40px] hidden sm:inline-flex" />
          <CarouselNext className="w-[50px] h-[40px] hidden sm:inline-flex" />
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
