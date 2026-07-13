import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Universal DL — Premium Web Video Downloader",
  description: "The fastest, most secure way to download videos from the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen relative bg-background text-[#ededed]`}>
        
        {/* Subtle animated grid background (Linear inspired) */}
        <div className="fixed inset-0 z-[-1] bg-grid opacity-[0.4] pointer-events-none" />
        
        {/* Super soft center glow */}
        <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />
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
