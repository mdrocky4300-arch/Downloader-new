import { exec } from "child_process";
import { promisify } from "util";
import ffmpegPath from "ffmpeg-static";

const execAsync = promisify(exec);

export const convertVideoToAudio = async (inputPath: string, outputPath: string): Promise<void> => {
  if (!ffmpegPath) {
    throw new Error("FFmpeg not found");
  }

  try {
    // -vn: no video, -c:a libmp3lame: mp3 codec, -q:a 2: high quality VBR
    const command = `"${ffmpegPath}" -i "${inputPath}" -vn -c:a libmp3lame -q:a 2 "${outputPath}"`;
    await execAsync(command);
  } catch (error) {
    console.error("FFmpeg conversion error:", error);
    throw new Error("Failed to convert video to audio");
  }
};
