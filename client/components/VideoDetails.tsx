"use client";

import { useState } from "react";
import { Download, Film, Music, Clock, Eye, User, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface Format {
  format_id: string;
  ext: string;
  resolution?: string;
  filesize?: number;
  fps?: number;
  abr?: number;
}

interface VideoData {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  view_count: number;
  videoFormats: Format[];
  audioFormats: Format[];
  originalUrl: string;
}

interface VideoDetailsProps {
  data: VideoData;
}

type Tab = "video" | "audio";

const getQualityBadge = (resolution?: string) => {
  if (!resolution) return null;
  const height = parseInt(resolution);
  if (height >= 2160) return { label: "4K", cls: "px-1.5 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold" };
  if (height >= 1080) return { label: "FHD", cls: "px-1.5 py-0.5 rounded border border-white/20 bg-white/10 text-white text-[10px] font-bold" };
  if (height >= 720)  return { label: "HD",  cls: "px-1.5 py-0.5 rounded border border-gray-500/30 bg-gray-500/10 text-gray-300 text-[10px] font-bold" };
  return { label: "SD", cls: "px-1.5 py-0.5 rounded border border-white/5 bg-transparent text-gray-500 text-[10px] font-medium" };
};

export function VideoDetails({ data }: VideoDetailsProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("video");

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s].filter(Boolean).join(":");
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  };

  const handleDownload = async (format: Format) => {
    setDownloadingFormat(format.format_id);
    setDownloadedFormat(null);

    try {
      const response = await api.post(
        "/download",
        {
          url: data.originalUrl,
          format: format.format_id,
          title: data.title,
          thumbnail: data.thumbnail,
          duration: data.duration,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data.title.replace(/[/\\?%*:|"<>]/g, "-")}.${format.ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      setDownloadedFormat(format.format_id);
      setTimeout(() => setDownloadedFormat(null), 3000);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  const FormatCard = ({ format }: { format: Format }) => {
    const isDownloading = downloadingFormat === format.format_id;
    const isDownloaded = downloadedFormat === format.format_id;
    const qb = getQualityBadge(format.resolution);

    return (
      <button
        onClick={() => handleDownload(format)}
        disabled={!!downloadingFormat}
        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group disabled:opacity-50 text-left
          ${isDownloading
            ? "border-white/30 bg-white/5"
            : "border-[rgba(255,255,255,0.08)] bg-[#111111] hover:bg-[#1a1a1a] hover:border-[rgba(255,255,255,0.2)]"
          }`}
      >
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#ededed] text-sm">
              {activeTab === "video"
                ? `${format.resolution || "Auto"}`
                : `${format.abr ? `${format.abr}kbps` : "Audio"}`}
            </span>
            <span className="text-[10px] text-gray-500 font-mono uppercase bg-white/5 px-1 rounded">{format.ext}</span>
            {qb && activeTab === "video" && (
              <span className={qb.cls}>{qb.label}</span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {format.fps ? `${format.fps}fps • ` : ""}
            {formatSize(format.filesize)}
          </span>
        </div>

        <div className={`flex-shrink-0 ml-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all
          ${isDownloaded
            ? "text-emerald-400 bg-emerald-500/10"
            : isDownloading
            ? "text-white bg-white/10"
            : "text-gray-500 bg-white/5 group-hover:bg-white group-hover:text-black"
          }`}
        >
          {isDownloaded ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </div>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* ─── Video Info Card ─── */}
      <div className="lg:col-span-1 premium-card p-5 flex flex-col h-fit">
        <div className="relative rounded-lg overflow-hidden aspect-video mb-5 border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.thumbnail} alt={data.title} className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity" />
          {data.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-white border border-white/10">
              {formatDuration(data.duration)}
            </span>
          )}
        </div>

        <h2 className="text-sm font-semibold text-[#ededed] mb-4 line-clamp-2 leading-relaxed">{data.title}</h2>

        <div className="space-y-3 text-xs text-gray-500 font-medium">
          {data.uploader && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{data.uploader}</span>
            </div>
          )}
          {data.view_count > 0 && (
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>{data.view_count.toLocaleString()} views</span>
            </div>
          )}
          {data.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatDuration(data.duration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Download Panel ─── */}
      <div className="lg:col-span-2 premium-card p-5 flex flex-col gap-5">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-black/50 rounded-lg border border-[rgba(255,255,255,0.06)]">
          {(["video", "audio"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#222222] text-white shadow-[0_1px_2px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.08)]"
                  : "text-gray-500 hover:text-gray-300 transparent border border-transparent"
              }`}
            >
              {tab === "video" ? <Film className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
              {tab === "video" ? "Video" : "Audio Only"}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-gray-400">
                {tab === "video" ? data.videoFormats.length : data.audioFormats.length}
              </span>
            </button>
          ))}
        </div>

        {/* Format Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)", position: "absolute" }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {activeTab === "video"
              ? data.videoFormats.slice(0, 10).map((f) => (
                  <FormatCard key={f.format_id} format={f} />
                ))
              : data.audioFormats.slice(0, 6).map((f) => (
                  <FormatCard key={f.format_id} format={f} />
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
