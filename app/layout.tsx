import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/layout/header";
import { Footer } from "@/layout/footer";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { PageTransition } from "@/components/page-transition";

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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
        lang="zh-CN"
        suppressHydrationWarning
        className={cn("h-full", "antialiased", alimamaFangYuan.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
        <Header />
        <div style={{ height: 90 }} />
        <main className="flex-1 px-4 sm:px-10 lg:px-48">
          <PageTransition>{children}</PageTransition>
        </main>
        <div style={{ height: 50 }} />
        <Footer/>
        </Providers>
      </body>
    </html>
  );
}
