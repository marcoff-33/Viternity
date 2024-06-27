import { BackgroundGradientAnimation } from "@/components/bgAnimation";
import { BackgroundBeams } from "@/components/bgBeams";
import { Vortex } from "@/components/bgSparkles";
import { PriceCard } from "@/components/priceCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background flex-col relative">
      <Vortex
        className="min-h-screen w-full z-50 "
        backgroundColor="transparent"
        baseHue={-100}
        particleCount={22}
        rangeY={10000}
        baseRadius={5}
        baseSpeed={0.1}
      />
      <div className="grow z-50 absolute inset-0">
        <div className="z-50 container relative flex flex-col gap-10 items-center justify-center min-h-screen overflow-hidden min-w-full">
          <div className="absolute bottom-10 left-0 right-0 text-primary text-center items-center justify-center flex self-center container">
            <IoIosArrowDropdown size={40} className="animate-pulse" />
          </div>
          <div className="z-50 bg-transparent p-5 backdrop-blur-sm">
            <h1 className="text-4xl font-semibold text-white">
              Turn Memories Into
              <span className="text-primary font-extrabold px-1">
                Timesless Treasures.
              </span>
            </h1>
          </div>
          <div className="flex flex-row">
            <Button asChild>
              <Link href="/dashboard">Our Offers</Link>
            </Button>
            <Button
              asChild
              variant={"ghost"}
              className="hover:bg-transparent hover:text-primary-foreground text-primary-foreground"
            >
              <Link href="/dashboard">
                Try it out for free
                <FaLongArrowAltRight className="mx-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container min-h-screen py-10">
        <h1 className="text-white font-semibold text-4xl self-center text-center">
          Pricing & Features
        </h1>
        <div className="flex lg:flex-row w-full justify-center py-20 gap-10 flex-col items-center lg:items-start">
          <PriceCard planType={"Free"} />
          <PriceCard planType="Premium" />
          <PriceCard className="" planType="Tailored" />
        </div>
      </div>
    </div>
  );
}
