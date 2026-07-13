"use client";

import { useState } from "react";
import { AnalyzerForm } from "@/components/AnalyzerForm";
import { VideoDetails } from "@/components/VideoDetails";
import { FileConverter } from "@/components/FileConverter";
import { Music, Download, Globe, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const SUPPORTED_SITES = [
  "YouTube", "Facebook", "Instagram", "TikTok", "Twitter", "Vimeo", "Reddit", "1000+ more"
];

const STATS = [
  { icon: Download, label: "Downloads", value: "10M+" },
  { icon: Globe, label: "Sites Supported", value: "1000+" },
  { icon: Zap, label: "Avg. Speed", value: "<1s" },
  { icon: Shield, label: "Privacy", value: "100%" },
];

export default function Home() {
  const [videoData, setVideoData] = useState<any | null>(null);

  return (
    <div className="flex-grow flex flex-col items-center px-4">

      {/* ─── Hero Section ─── */}
      <section className="w-full flex flex-col items-center pt-24 pb-20">

        {/* Minimal Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-gray-400 text-xs tracking-wide">
            <span className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            Universal Download Engine 2.0
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-2">
            Download Anything.
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            The most advanced tool to extract videos and audio from the web. 
            No compression, no ads, completely open.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl"
        >
          <AnalyzerForm onAnalyzeSuccess={(data) => setVideoData(data)} />
        </motion.div>

        {/* Text Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500"
        >
          {SUPPORTED_SITES.map((site) => (
            <span key={site} className="hover:text-gray-300 transition-colors cursor-default">
              {site}
            </span>
          ))}
        </motion.div>

        {/* Stats Grid - Vercel style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-px mt-16 w-full max-w-4xl sm:bg-white/5 sm:border sm:border-white/10 sm:rounded-2xl overflow-hidden"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-black/40 sm:bg-black/90 p-6 flex flex-col items-center sm:items-start border border-white/5 sm:border-none rounded-2xl sm:rounded-none">
              <Icon className="w-5 h-5 text-gray-400 mb-4" />
              <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Results */}
        {videoData && (
          <div className="w-full mt-12">
            <VideoDetails data={videoData} />
          </div>
        )}
      </section>

      {/* ─── Divider ─── */}
      <div id="converter" className="w-full max-w-5xl flex items-center gap-4 py-8 scroll-mt-32">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
        <div className="px-3 text-[10px] uppercase tracking-widest font-semibold text-gray-500">
          Audio Extraction
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
      </div>

      {/* ─── File Converter Section ─── */}
      <section className="w-full flex flex-col items-center pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Convert to MP3.
          </h2>
          <p className="text-gray-400 leading-relaxed font-light">
            Locally process and extract high-quality audio streams from any video file format. 
            No server upload required for local processing (max 50MB).
          </p>
        </motion.div>
        <FileConverter />
      </section>

    </div>
  );
}
