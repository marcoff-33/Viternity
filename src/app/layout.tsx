import type { Metadata } from "next";
import { Averia_Serif_Libre } from "next/font/google";
import "./globals.css";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/themeToggle";

export const metadata: Metadata = {
  title: "Viternity",
  description: "A place to store & share your memories",
};

const averiaSerifLibre = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-Serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-backgroundfont-Serif antialiased relative",
            averiaSerifLibre.className
          )}
        >
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange={true}
            defaultTheme="system"
            enableSystem
          >
            <Suspense fallback={<Loading />}>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
