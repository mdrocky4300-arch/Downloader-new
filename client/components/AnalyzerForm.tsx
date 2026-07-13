"use client";

import { useState } from "react";
import { Search, Loader2, Clipboard, AlertCircle, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface AnalyzerFormProps {
  onAnalyzeSuccess: (data: any) => void;
}

export function AnalyzerForm({ onAnalyzeSuccess }: AnalyzerFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post("/analyze", { url });
      onAnalyzeSuccess({ ...res.data, originalUrl: url });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to analyze video URL. Please check the link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleAnalyze} className="relative z-10">
        <div 
          className={`relative flex items-center bg-[#0a0a0a] rounded-2xl p-1.5 transition-all duration-500 shadow-glass ${
            focused ? "shadow-[0_0_0_1px_#ffffff] scale-[1.01]" : "shadow-[0_0_0_1px_rgba(255,255,255,0.12)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
          }`}
        >
          {/* Search Icon */}
          <div className="pl-4 pr-2 text-gray-500 flex-shrink-0 hidden sm:block">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste your link here..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[#ededed] placeholder:text-gray-600 py-3 px-2 text-sm sm:text-base font-medium"
            required
            disabled={isLoading}
          />

          {/* Paste Button */}
          {!url && (
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="flex-shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors mr-1"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !url}
            className={`flex-shrink-0 px-5 sm:px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
              url && !isLoading
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-[#1a1a1a] text-gray-500"
            }`}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
            ) : (
              <><span className="hidden sm:inline">Extract</span><CornerDownLeft className="w-4 h-4 sm:hidden" /></>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            className="absolute left-0 right-0 mt-4 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
