"use client";

import { useState } from "react";
import { AnalyzerForm } from "@/components/AnalyzerForm";
import { VideoDetails } from "@/components/VideoDetails";

export default function Home() {
  const [videoData, setVideoData] = useState<any | null>(null);

  return (
    <div className="flex-grow flex flex-col items-center py-20 px-4">
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
          Download Any Video, Anywhere.
        </h1>
        <p className="text-lg text-gray-400">
          Fast, free, and secure. Enter the URL of your favorite video to get started. Supports 1000+ sites including YouTube, Vimeo, and more.
        </p>
      </div>

      <AnalyzerForm 
        onAnalyzeSuccess={(data) => {
          setVideoData(data); // Pass url for download
        }} 
      />

      {videoData && <VideoDetails data={videoData} />}
    </div>
  );
}
