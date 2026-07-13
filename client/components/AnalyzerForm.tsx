"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface AnalyzerFormProps {
  onAnalyzeSuccess: (data: any) => void;
}

export function AnalyzerForm({ onAnalyzeSuccess }: AnalyzerFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await api.post("/analyze", { url });
      onAnalyzeSuccess({ ...res.data, originalUrl: url });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to analyze video URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleAnalyze} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-cards rounded-2xl p-2 border border-white/10 shadow-2xl">
          <div className="pl-4 pr-2 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here... (YouTube, Vimeo, etc.)"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-4 text-lg"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
          </button>
        </div>
      </form>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-400 mt-4 text-center text-sm bg-red-400/10 py-2 px-4 rounded-lg border border-red-400/20 inline-block"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
