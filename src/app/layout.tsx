import type { Metadata } from "next";
import { Averia_Serif_Libre } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { Suspense, use } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { SessionProvider, useSession } from "next-auth/react";
import { auth } from "./utils/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
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
          <SessionProvider session={session}>
            <Suspense fallback={<Loading />}>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </Suspense>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
