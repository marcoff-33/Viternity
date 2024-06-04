import { BackgroundGradientAnimation } from "@/components/bgAnimation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <BackgroundGradientAnimation
        interactive={false}
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(255, 250, 255)"
        firstColor="159, 199, 242"
        secondColor="158, 199, 242"
        thirdColor="158, 199, 242"
        fourthColor="158, 199, 242"
        fifthColor="158, 199, 242"
        className=""
      >
        <div className="z-50 flex flex-row gap-5 items-center justify-center w-full min-h-screen absolute">
          <Button asChild>
            <Link href="/dashboard">Create A Vault</Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href="/dashboard">Learn More</Link>
          </Button>
        </div>
      </BackgroundGradientAnimation>
    </main>
  );
}
