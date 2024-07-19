"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./themeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiCardJackHearts } from "react-icons/gi";

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

  return (
    <header
      className={`z-[1000] transition-all duration-200 w-full justify-center items-center backdrop-blur-md  top-0 ${
        isScrolled && fullRenderInPath.includes(pathName)
          ? "md:py-5 bg-background/70"
          : "md:py-2 bg-background"
      } ${fullRenderInPath.includes(pathName) ? "sticky" : "relative"}`}
    >
      <div
        className={`container w-full flex flex-col transition-all gap-0 duration-200 `}
      >
        <Link
          href="/"
          className="md:text-4xl text-lg justify-center text-center items-center py-2"
        >
          Viternity
        </Link>

        <div
          className={`bg-background grow flex border rounded-[2px] shadow-md   transition-all duration-200 justify-center ${
            isScrolled && fullRenderInPath.includes(pathName)
              ? "shadow-black border-border"
              : "shadow-transparent border-transparent"
          } ${fullRenderInPath.includes(pathName) ? "flex" : "hidden"}`}
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
          <ThemeToggle />
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
      className={`px-5 py-1 last:border-none first:rounded-l-[2px] last:rounded-r-[1px] border-r border-border transition-all duration-200 flex-col basis-1/3 text-center items-center flex justify-center ${
        currentPath === href
          ? "bg-primary text-primary-foreground"
          : "bg-transparent"
      }`}
    >
      <div className="md:text-lg text-sm font-thin text-nowrap">{children}</div>
    </Link>
  );
};
