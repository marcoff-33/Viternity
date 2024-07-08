import { ImagesCarousel } from "@/components/ImagesCarousel";
import { BackgroundGradientAnimation } from "@/components/bgAnimation";
import { BackgroundBeams } from "@/components/bgBeams";
import { Vortex } from "@/components/bgSparkles";
import { PriceCard } from "@/components/priceCard";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CiSquarePlus } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { SiSimplelogin } from "react-icons/si";
import { server_getVaultData } from "./utils/serverActions";
import { BsQrCode } from "react-icons/bs";
import { LuQrCode } from "react-icons/lu";

export default async function Home() {
  const data = await server_getVaultData("LancPr6TPNSZPZtq8ckj");
  return (
    <main className="container flex-col  bg-background min-h-screen flex">
      <article className="border-b-[2px] border-border min-h-[90vh] md:px-5 flex-col bg-background grow gap-2 flex justify-center rounded-[3px]">
        <div className="basis-1/2 self-center md:text-center items-end flex justify-end text-primary text-4xl font-bold">
          I Tuoi ricordi dal Mondo Digitale al Materiale.
        </div>
        <div className="basis-1/2 self-center py-2 md:text-center items-end flex justify-end text-secondary text-2xl font-semibold">
          Crea le Tue Gallerie di Immagini e Video e condividile in qualsiasi
          luogo in totale sicurezza via QR Code.
        </div>
        <LuQrCode className="self-center text-primary mr-5 md:mr-0" size={50} />
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
      </article>
      <article className="gap-10 px-10  flex md:flex-row flex-col md:justify-around justify-center items-center bg-background rounded-[3px] w-full h-fit my-10">
        <div className="max-w-fit items-center self-center flex justify-center flex-col gap-10 border-b-[2px] border-border pb-10">
          <h1 className="text-4xl text-primary basis-1/2 items-center py-5">
            Carica le tue immagini e video.
          </h1>
          <ImagesCarousel
            isEditable={false}
            vaultId="LancPr6TPNSZPZtq8ckj"
            vaultImages={data.imageUrls}
            isDecorative={false}
            isDisabled={false}
          />
          <p className="text-secondary">
            Aggiungi i Tuoi ricordi da condividire pubblicamente a chiunque
            scansioni il codice QR, o rendi la tua Galleria privata via
            password.
          </p>
        </div>
      </article>
      <article className="gap-10 px-10 flex md:flex-row flex-col md:justify-around justify-center items-center bg-background rounded-[3px] h-fit w-full my-10">
        <div className="max-w-fit items-center flex justify-center self-start pt-5">
          <div className="">
            <h2 className="text-4xl font-bold text-primary">
              Personalizza la tua Galleria.
            </h2>
            <p>
              Scegli l'aspetto che preferisci per la tua Galleria.......(PAGINA
              DA COMPLETARE)
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
