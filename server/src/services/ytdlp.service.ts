import { spawn, exec } from "child_process";
import { promisify } from "util";
import path from "path";
import ffmpegPath from "ffmpeg-static";

const execAsync = promisify(exec);

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  view_count: number;
  formats: any[];
}

// Ensure it points to our local yt-dlp.exe if on windows
const ytDlpPath = process.platform === 'win32' 
  ? path.join(process.cwd(), "yt-dlp.exe") 
  : (process.env.YT_DLP_PATH || "yt-dlp");

export const analyzeVideoUrl = async (url: string): Promise<VideoInfo> => {
  try {
    const { stdout } = await execAsync(`"${ytDlpPath}" --dump-json --no-warnings --skip-download "${url}"`);
    const info = JSON.parse(stdout);
    
    return info as VideoInfo;
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw new Error("Failed to analyze video URL");
  }
};

export const downloadToDisk = (url: string, format: string, filepath: string) => {
  const args = [
    url,
    "-f", format,
    "--merge-output-format", "mp4",
    "-o", filepath,
    "--no-warnings",
    "--quiet"
  ];

  if (ffmpegPath) {
    args.push("--ffmpeg-location", ffmpegPath);
  }
  
  return spawn(ytDlpPath, args);
};
