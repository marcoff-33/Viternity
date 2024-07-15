import { ImagesCarousel } from "@/components/ImagesCarousel";
import { BackgroundGradientAnimation } from "@/components/bgAnimation";
import { BackgroundBeams } from "@/components/bgBeams";
import { Vortex } from "@/components/bgSparkles";
import { PriceCard } from "@/components/priceCard";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CiSquarePlus } from "react-icons/ci";
import { FaLongArrowAltRight, FaRegHeart } from "react-icons/fa";
import { SiSimplelogin } from "react-icons/si";
import { server_getVaultData } from "./utils/serverActions";
import { BsQrCode } from "react-icons/bs";
import { LuCoffee, LuPlane, LuQrCode } from "react-icons/lu";
import { IoIosMegaphone } from "react-icons/io";
import { SignIn } from "@/components/SignIn";
import { auth } from "@/app/utils/auth";

export default async function Home() {
  return (
    <main className="flex-col  bg-background min-h-screen flex">
      <article className="border-y-[2px] mt-5 relative border-border md:min-h-[80vh] md:px-5 flex-col bg-background grow gap-2 flex justify-center rounded-[3px] max-h-[80vh]">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat block saturate-50  opacity-15"
          style={{ backgroundImage: `url(/herobg.jpg)` }}
        ></div>
        <div className="container bg-transparent flex flex-col gap-10 px-10 py-5 md:py-10 z-50">
          <div className="basis-1/2 self-center md:text-center items-end flex justify-end text-primary text-4xl font-bold">
            Materializza e Condividi Le Tue Immagini, Video o pensieri.
          </div>
          <div className="basis-1/2 self-center py-2 md:text-center items-end flex justify-end text-secondary text-2xl font-semibold">
            Stickers con QR Code pronti all'uso. Gestisci i tuoi contenuti in
            modo semplice e sicuro.
          </div>

          <div className="basis-1/2 flex md:flex-row flex-col w-full gap-5 justify-center pt-10">
            <Button className="text-xl font-extrabold md:pr-20 pr-10 pl-5">
              OFFERTE
            </Button>
            <Button className="text-xl font-semibold" variant={"link"} asChild>
              <Link href="/dashboard">
                PROVA GRATUITA
                <FaLongArrowAltRight className="mx-1 text-primary" size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </article>
      <article className="gap-10 px-10  flex md:flex-row flex-col md:justify-around justify-center items-center bg-background rounded-[3px] w-full h-fit my-10">
        <div className="container max-w-fit w-full h-[100vh] items-center self-center flex justify-between min-w-full md:flex-row flex-col gap-10 border-b-[2px] border-border pb-10">
          <div
            className="w-full min-h-full bg-contain bg-no-repeat bg-center basis-1/2 relative md:block hidden"
            style={{ backgroundImage: `url(/hero2.jpg)` }}
          ></div>

          <div className="text-secondary flex justify-start basis-1/2 items-start text-start grow min-h-full flex-col gap-10">
            <h1 className="text-4xl font-bold self-start text-primary">
              Versatili e Personalizzabili per tutte le tue necessità.
            </h1>
            <div
              className=" flex flex-col gap-5 justify-center
            "
            >
              <p className="text-2xl flex flex-col gap-2 text-center items-center border-b pb-5">
                <LuCoffee />
                Menù per il tuo ristorante o bar.
              </p>
              <p className="text-2xl flex flex-col gap-2 text-center items-center border-b pb-5">
                <IoIosMegaphone />
                Per pubblicizzare la tua attività.
              </p>
              <p className="text-2xl flex flex-col gap-2 text-center items-center  border-b pb-5">
                <LuPlane />
                Per ricordare le tue avventure o vacanze.
              </p>
              <p className="text-2xl flex flex-col gap-2 text-center items-center  md:border-b pb-5">
                <FaRegHeart className="text-red-500" />
                Per immortalare i ricordi dei nostri cari ...
              </p>
            </div>
            <Button className="text-xl font-extrabold md:pr-20 pr-10 pl-5 self-center">
              Scompri Alcuni Esempi{" "}
              <FaLongArrowAltRight
                className="mx-1 text-primary-foreground"
                size={15}
              />
            </Button>
          </div>
        </div>
      </article>
      <article className="gap-10 px-10 flex md:flex-row flex-col md:justify-around justify-center items-center bg-background rounded-[3px] h-fit w-full my-10">
        <div className="max-w-fit items-center flex justify-center self-start pt-5">
          <div className="border border-border">
            <h2 className="text-4xl font-bold text-primary">
              PRIVACY & ENCRYPTION . .... . .
            </h2>
          </div>
        </div>
      </article>
    </main>
  );
}
