"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart3, Download, Settings, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl flex-grow">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> Admin Dashboard
        </h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/20">
          <Activity className="w-4 h-4" /> System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="glass-card p-6 border-t-4 border-t-primary">
          <div className="text-gray-400 text-sm mb-1">Downloads Today</div>
          <div className="text-3xl font-bold text-white">{data.stats.downloadsToday}</div>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-secondary">
          <div className="text-gray-400 text-sm mb-1">Total Downloads</div>
          <div className="text-3xl font-bold text-white">{data.stats.totalDownloads}</div>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-accent">
          <div className="text-gray-400 text-sm mb-1">Active Users</div>
          <div className="text-3xl font-bold text-white">42</div> {/* Mocked */}
        </div>
        <div className="glass-card p-6 border-t-4 border-t-gray-500">
          <div className="text-gray-400 text-sm mb-1">Server Load</div>
          <div className="text-3xl font-bold text-white">12%</div> {/* Mocked */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Formats */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" /> Popular Formats
          </h2>
          <div className="space-y-4">
            {data.stats.popularFormats.map((f: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="font-medium text-white uppercase">{f.format}</span>
                <span className="text-gray-400">{f.count} downloads</span>
              </div>
            ))}
            {data.stats.popularFormats.length === 0 && (
              <div className="text-gray-500 text-center py-4">No data available</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              <span className="text-white">Maintenance Mode</span>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${data.settings.maintenanceMode ? 'bg-primary' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${data.settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              <span className="text-white">Clear Error Logs</span>
              <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">0 errors</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              <span className="text-white text-red-400">Restart Services</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
