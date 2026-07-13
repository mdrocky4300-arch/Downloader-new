"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Trash2, ExternalLink, History, Clock, Film, Music, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    try {
      await api.delete("/history");
      setHistory([]);
    } catch {
      alert("Failed to clear history");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return <span className="badge-green">● Completed</span>;
      case "FAILED":    return <span className="badge-red">● Failed</span>;
      default:          return <span className="badge-yellow">● Downloading</span>;
    }
  };

  const isAudio = (format: string) => ["mp3", "m4a", "opus", "aac", "webm"].includes(format?.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-grow">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            Download History
          </h1>
          <p className="text-gray-500 text-sm mt-2">Your last 10 downloads are stored here.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/20 rounded-xl transition-all text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <History className="w-10 h-10 text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">No downloads yet</p>
            <p className="text-gray-500 text-sm mt-1">Your download history will appear here.</p>
          </div>
          <a href="/" className="mt-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-all">
            Start Downloading
          </a>
        </motion.div>
      )}

      {/* History List */}
      <div className="grid gap-3">
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              layout
              className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative border border-white/5">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    {isAudio(item.format) ? <Music className="w-6 h-6" /> : <Film className="w-6 h-6" />}
                  </div>
                )}
                {item.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-mono">
                    {Math.floor(item.duration / 60)}:{("0" + (item.duration % 60)).slice(-2)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-white mb-2 truncate leading-snug" title={item.title}>
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="badge bg-primary/10 text-primary border-primary/20 uppercase">
                    {item.format}
                  </span>
                  {getStatusBadge(item.status)}
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Source
                  </a>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="flex-shrink-0 p-2.5 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete"
              >
                {deletingId === item.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
