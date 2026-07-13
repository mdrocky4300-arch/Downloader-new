"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Music, FileVideo, X, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const MAX_SIZE_MB = 50;

type Status = "idle" | "uploading" | "converting" | "done" | "error";

export function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(15);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("video", file);

      // Fake progress ticks while uploading
      const tick = setInterval(() => {
        setProgress((p) => (p < 70 ? p + 5 : p));
      }, 400);

      setStatus("converting");
      const response = await fetch(`${BACKEND_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      clearInterval(tick);
      setProgress(90);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Conversion failed" }));
        throw new Error(err.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      a.href = url;
      a.download = `${baseName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isProcessing = status === "uploading" || status === "converting";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* ─── Drop Zone ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !file && !isProcessing && inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300
            ${isDragging
              ? "border-primary bg-primary/10 scale-[1.01] glow-primary"
              : file
              ? "border-white/15 bg-white/3 cursor-default"
              : "border-white/15 hover:border-primary/50 hover:bg-white/3 cursor-pointer"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.wmv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {!file ? (
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? "bg-primary/20 scale-110" : "bg-white/5 border border-white/10"}`}>
                <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {isDragging ? "Drop it here!" : "Drop your video file here"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  or <span className="text-primary underline cursor-pointer">browse files</span> — MP4, MKV, AVI, MOV, WEBM (max {MAX_SIZE_MB}MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <FileVideo className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-grow text-left min-w-0">
                <p className="text-white font-semibold truncate">{file.name}</p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Progress ─── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card px-5 py-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  {status === "uploading" ? "Uploading..." : "Converting to MP3..."}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Status: Done ─── */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-green-500/8 border border-green-500/20 rounded-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-green-400 text-sm font-semibold">Conversion complete!</p>
              <p className="text-green-400/60 text-xs">Your MP3 has been downloaded.</p>
            </div>
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Convert another <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Status: Error ─── */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-red-500/8 border border-red-500/20 rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-red-400 text-sm font-semibold">Conversion failed</p>
              <p className="text-red-400/70 text-xs mt-0.5">{errorMsg}</p>
            </div>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-white transition-colors">
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Convert Button ─── */}
      <AnimatePresence>
        {file && status !== "done" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 glow-primary"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {status === "uploading" ? "Uploading..." : "Converting..."}</>
            ) : (
              <><Music className="w-5 h-5" /> Convert to MP3</>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
