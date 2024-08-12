import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLongArrowAltRight, FaRegHeart } from "react-icons/fa";
import { GrMap } from "react-icons/gr";
import Example from "@/components/Example";
import { MdRestaurantMenu } from "react-icons/md";
import { TbBuildingWarehouse } from "react-icons/tb";
import { LuPalmtree } from "react-icons/lu";

export default async function Home() {
  return (
    <main className="flex-col  bg-background min-h-screen flex 4xl:container">
      <article className="border-y-[2px] mt-5 relative border-border md:px-5 flex-col bg-background grow gap-2 flex justify-center rounded-[3px] min-h-[50vh] ">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat block max-w-full xl:rounded-[3px] brightness-50 saturate-50 "
          style={{ backgroundImage: `url(/herobg.jpg)` }}
        ></div>
        <div className="container flex flex-col gap-10 px-10 py-5 md:py-10 z-50">
          <h1 className="basis-1/2 self-center md:text-start items-end flex justify-end text-white text-4xl font-bold">
            Il Modo più semplice per creare annunci o pubblictà da condividere
            via QR Code.
          </h1>

          <div className="basis-1/2 flex md:flex-row flex-col w-full gap-5 justify-center pt-10 ">
            <Button className="text-xl font-extrabold md:pr-20 pr-10 pl-5">
              I nostri servizi
            </Button>
            <Button
              className="text-xl font-semibold text-white"
              variant={"link"}
              asChild
            >
              <Link href="/dashboard">
                Prova Gratuita
                <FaLongArrowAltRight className="mx-1" size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </article>
      <article className="gap-10 p-10  flex flex-col md:justify-around justify-center items-center bg-background rounded-[3px] w-full h-fit">
        <div className="self-center text-4xl text-foreground font-bold">
          Da utilizzare come :
        </div>
        <div className="flex gap-5 flex-col md:flex-row justify-around items-center">
          <Example
            icon={<MdRestaurantMenu size={25} className="text-accent" />}
            title="Menù"
            description="Per il tuo ristorante"
          />
          <Example
            icon={<GrMap size={25} className="text-accent" />}
            title="Annunci"
            description="Per la tua attività o evento"
          />
          <Example
            icon={<TbBuildingWarehouse size={25} className="text-accent" />}
            title="Invetario"
            description="Per il tuo magazzino"
          />
          <Example
            icon={<LuPalmtree size={25} className="text-accent" />}
            title="Diario"
            description="Per i tuoi ricordi"
          />
        </div>
        <Button className="hidden md:flex text-xl font-extrabold md:pr-20 pr-10 pl-5">
          Scopri tutti i design e template disponibili
        </Button>
        <Button className="md:hidden text-xl font-extrabold md:pr-20 pr-10 pl-5">
          Esplora template & design
        </Button>
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
