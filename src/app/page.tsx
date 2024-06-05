import { BackgroundGradientAnimation } from "@/components/bgAnimation";
import { BackgroundBeams } from "@/components/bgBeams";
import { PriceCard } from "@/components/priceCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-foreground flex-col">
      <BackgroundBeams className="absolute top-0 left-0 right-0 z-0" />
      <div className="grow z-50">
        <div className="z-50 container flex flex-col gap-10 items-center justify-center min-h-screen overflow-hidden min-w-full">
          <div className="z-50">
            <h1 className="text-4xl font-semibold text-white">
              Turn Memories Into
              <span className="text-primary font-extrabold px-1">
                Timesless Treasures.
              </span>
            </h1>
          </div>
          <div className="flex flex-row">
            <Button asChild>
              <Link href="/dashboard">Create A Vault</Link>
            </Button>
            <Button
              asChild
              variant={"ghost"}
              className="hover:bg-transparent hover:text-primary-foreground text-primary-foreground"
            >
              <Link href="/dashboard">
                Learn More <FaLongArrowAltRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-primary text-center items-center justify-center flex">
          <IoIosArrowDropdown size={40} className="animate-pulse" />
        </div>
      </div>
      <div className="container min-h-screen">
        <h1 className="text-white font-semibold text-4xl self-center text-center">
          Pricing & Features
        </h1>
        <div className="flex flex-row w-full justify-center py-20 gap-10">
          <PriceCard planType={"Free"} />
          <PriceCard planType="Premium" />
          <PriceCard className="" planType="Tailored" />
        </div>
      </div>
    </div>
  );
}
