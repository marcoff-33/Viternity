"use client";

import * as React from "react";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
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

export function ImagesCarousel() {
  const [vaultData, setVaultData] = useState<Vault | undefined>(undefined);
  const pathname = usePathname();
  const vaultId = pathname.split("/")[1];

  const handleFirstLoad = async () => {
    const data = await server_getVaultData(vaultId);
    setVaultData(data);
  };

  useEffect(() => {
    handleFirstLoad();
    console.log("loaded", vaultData, vaultId);
  }, []);

  const vaultImages = vaultData?.imageUrls;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-[300px] rounded-lg ">
          <AspectRatio
            ratio={5 / 4}
            className="border rounded-lg relative bg-primary/50"
          >
            {vaultData && (
              <>
                <IoIosPhotos
                  className="absolute z-50 text-white top-2 right-2"
                  size={30}
                />
                <img
                  src={vaultImages![1]}
                  alt=""
                  className="object-cover object-center absolute h-full w-full rounded-lg bg-accent/10"
                  loading="lazy"
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
      <DialogContent className="min-w-[95vw] max-h-[95vh] max-w-4xl border-none  shadow-none bg-transparent backdrop-blur-md">
        <Carousel className="">
          <CarouselContent className="items-center">
            {vaultImages?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="">
                  <CardContent className="bg-background/10 items-center flex justify-center rounded-lg">
                    <img
                      src={image}
                      alt=""
                      className="object-contain max-h-[85vh] aspect-auto"
                    />
                  </CardContent>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
