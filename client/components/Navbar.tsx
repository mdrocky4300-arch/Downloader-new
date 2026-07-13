"use client";

import Link from "next/link";
import { CloudDownload, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <CloudDownload className="w-8 h-8" />
          <span className="font-bold text-xl text-white">Universal DL</span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">History</Link>
          <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 w-full glass border-b border-white/10 py-4 flex flex-col items-center gap-4"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-medium">Home</Link>
            <Link href="/history" onClick={() => setIsOpen(false)} className="text-sm font-medium">History</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-sm font-medium">Admin</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-sm font-medium">About</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
