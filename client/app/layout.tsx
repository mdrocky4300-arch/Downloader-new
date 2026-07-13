import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  themeColor: "#050816",
};

export const metadata: Metadata = {
  title: "Universal Video Downloader",
  description: "Ultra-modern, premium quality downloader for web videos.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Universal Video Downloader",
    description: "Ultra-modern, premium quality downloader for web videos.",
    url: "https://universaldl.com",
    siteName: "Universal DL",
    images: [
      {
        url: "https://universaldl.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Video Downloader",
    description: "Ultra-modern, premium quality downloader for web videos.",
    images: ["https://universaldl.com/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen relative`}>
        {/* Animated Shapes Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/20 blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[150px] mix-blend-screen" />
        </div>
        
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
