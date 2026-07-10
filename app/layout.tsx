import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/layout/header";
import { Footer } from "@/layout/footer";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const alimamaFangYuan = localFont({
  src: "../public/font/Alimama.ttf",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koring Team",
  description: "Koring Team 工作室",
  icons: {
    icon: "/run.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
        lang="en"
        suppressHydrationWarning
        className={cn("h-full", "antialiased", alimamaFangYuan.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
        <Header />
        <div style={{ height: 90 }} />
        <main className="flex-1 px-4 sm:px-10 lg:px-48">
          {children}
        </main>
        <div style={{ height: 50 }} />
        <Footer/>
        </Providers>
      </body>
    </html>
  );
}
