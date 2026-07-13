"use client";

import { useState } from "react";
import { Download, Film, Music, Clock, Eye, User } from "lucide-react";
import { motion } from "framer-motion";
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

export function VideoDetails({ data }: VideoDetailsProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(Boolean).join(':');
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleDownload = async (format: Format) => {
    setDownloadingFormat(format.format_id);
    
    try {
      const response = await api.post("/download", {
        url: data.originalUrl,
        format: format.format_id,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration
      }, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.title.replace(/[/\\?%*:|"<>]/g, '-')}.${format.ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
    } catch (error) {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Video Info Card */}
      <div className="lg:col-span-1 glass-card p-6 flex flex-col h-fit">
        <div className="relative rounded-xl overflow-hidden aspect-video mb-6 shadow-lg border border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={data.thumbnail} 
            alt={data.title} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4 line-clamp-2">{data.title}</h2>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>{data.uploader}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-secondary" />
            <span>{data.view_count?.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span>{formatDuration(data.duration)}</span>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Video Formats */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Film className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-white">Video Options</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.videoFormats.slice(0, 10).map((format) => (
              <button
                key={format.format_id}
                onClick={() => handleDownload(format)}
                disabled={downloadingFormat === format.format_id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all group disabled:opacity-50"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-white group-hover:text-primary transition-colors">
                    {format.resolution || 'Auto'} • {format.ext.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format.fps ? `${format.fps}fps • ` : ''}{formatSize(format.filesize)}
                  </span>
                </div>
                {downloadingFormat === format.format_id ? (
                   <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                     <Download className="w-4 h-4 text-primary animate-bounce" />
                   </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Formats */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Music className="w-6 h-6 text-secondary" />
            <h3 className="text-xl font-bold text-white">Audio Options</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.audioFormats.slice(0, 6).map((format) => (
              <button
                key={format.format_id}
                onClick={() => handleDownload(format)}
                disabled={downloadingFormat === format.format_id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-secondary/20 hover:border-secondary/50 transition-all group disabled:opacity-50"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-white group-hover:text-secondary transition-colors">
                    {format.abr ? `${format.abr}kbps` : 'Audio'} • {format.ext.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatSize(format.filesize)}
                  </span>
                </div>
                {downloadingFormat === format.format_id ? (
                   <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
                     <Download className="w-4 h-4 text-secondary animate-bounce" />
                   </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
