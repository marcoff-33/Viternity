"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./themeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiCardJackHearts } from "react-icons/gi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();
  const handleScroll = () => {
    const position = window.scrollY;
    setIsScrolled(position > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    console.log("scrollPosition");
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fullRenderInPath = ["/faq", "/pricing", "/examples", "/"];

  const session = useSession();
  console.log(session);

  return (
    <header
      className={`z-[1000] transition-all duration-200 w-full justify-center items-center backdrop-blur-md  top-0 ${
        isScrolled && fullRenderInPath.includes(pathName)
          ? "md:py-5 bg-background/70"
          : "md:py-2 bg-background"
      } ${
        fullRenderInPath.includes(pathName)
          ? "sticky"
          : "relative bg-transparent"
      }`}
    >
      <div
        className={`container w-full flex flex-col transition-all gap-0 duration-200 `}
      >
        <Link
          href="/"
          className="md:text-4xl max-w-fit text-lg justify-center text-center items-center py-2 self-center"
        >
          Viternity
        </Link>

        <div
          className={`grow flex rounded-[2px] transition-all duration-200 justify-center ${
            isScrolled && fullRenderInPath.includes(pathName)
              ? "border-border"
              : "border-transparent"
          } ${fullRenderInPath.includes(pathName) ? "flex" : "hidden"}`}
        >
          <div className="w-[50px] h-[50px] "></div>
          <div
            className={`flex flex-row w-full shadow-lg transition-all duration-200 justify-center ${
              isScrolled && fullRenderInPath.includes(pathName)
                ? "shadow-black border-border"
                : "shadow-transparent border-transparent"
            }`}
          >
            <NavLink href="/faq" isScrolled={isScrolled} currentPath={pathName}>
              Dashboard
            </NavLink>
            <NavLink
              href="/pricing"
              isScrolled={isScrolled}
              currentPath={pathName}
            >
              Prezzi
            </NavLink>
            <NavLink
              href="/examples"
              isScrolled={isScrolled}
              currentPath={pathName}
            >
              Esempi
            </NavLink>
          </div>
          <Popover>
            <PopoverTrigger className="" disabled={!session.data?.user}>
              <div className="w-[40px] h-[40px] ml-5">
                {session.data?.user ? (
                  <img
                    src={session.data?.user.image || ""}
                    alt=""
                    className={`w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full shadow-md shadow-shadow ${
                      session.data?.user ? "block" : "invisible"
                    }`}
                  />
                ) : (
                  <Button asChild>
                    <Link
                      className="w-full h-full bg-gradient-to-br from-background to-secondary rounded-full shadow-md shadow-shadow"
                      href={"/dashboard"}
                    ></Link>
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="z-[5000] flex flex-col gap-2 justify-center">
              <div className="">{session.data?.user?.name}</div>
              <Button onClick={() => signOut()}>SignOut</Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export const NavLink = ({
  children,
  href,
  isScrolled,
  currentPath,
}: {
  children: React.ReactNode;
  href: string;
  isScrolled: boolean;
  currentPath: string;
}) => {
  return (
    <Link
      href={href}
      className={`px-5 py-1  first:rounded-l-[2px] last:rounded-r-[1px] border-x border-border transition-all duration-200 flex-col basis-1/3 text-center items-center flex justify-center ${
        currentPath === href
          ? "bg-primary text-primary-foreground"
          : "bg-background"
      }`}
    >
      <div className="md:text-lg text-sm font-thin text-nowrap">{children}</div>
    </Link>
  );
};
