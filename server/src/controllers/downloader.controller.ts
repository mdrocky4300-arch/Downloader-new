import { Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { analyzeVideoUrl, downloadToDisk } from "../services/ytdlp.service";
import { prisma } from "../index";

const analyzeSchema = z.object({
  url: z.string().url(),
});

const downloadSchema = z.object({
  url: z.string().url(),
  format: z.string(),
  title: z.string(),
  thumbnail: z.string().optional(),
  duration: z.number().optional()
});

export const analyzeVideo = async (req: Request, res: Response) => {
  try {
    const { url } = analyzeSchema.parse(req.body);
    const info = await analyzeVideoUrl(url);

    const calculateApproxSize = (f: any, duration: number) => {
       if (f.filesize) return f.filesize;
       if (f.filesize_approx) return f.filesize_approx;
       if (duration) {
          const bitrate = f.tbr || f.vbr || f.abr;
          if (bitrate) {
             return Math.round((bitrate * 1000 / 8) * duration);
          }
       }
       return undefined;
    };
    
    const videoFormats: any[] = [];
    
    // Always provide the fallback best merged option first
    videoFormats.push({
      format_id: "best",
      ext: "mp4",
      resolution: "Best (With Sound)",
      filesize: undefined,
      fps: undefined
    });

    // Group formats by height
    const formatsByHeight = new Map<number, any>();
    
    info.formats.forEach((f: any) => {
      if (f.vcodec !== 'none' && f.height) {
        if (!formatsByHeight.has(f.height)) {
           formatsByHeight.set(f.height, f);
        } else {
           // update if filesize is bigger (better quality for same height)
           const existing = formatsByHeight.get(f.height);
           const fSize = calculateApproxSize(f, info.duration) || 0;
           const existingSize = calculateApproxSize(existing, info.duration) || 0;
           if (fSize > existingSize) {
              formatsByHeight.set(f.height, f);
           }
        }
      }
    });

    // Convert map to array and sort by height descending
    const sortedHeights = Array.from(formatsByHeight.keys()).sort((a, b) => b - a);
    
    for (const h of sortedHeights) {
       const bestMatch = formatsByHeight.get(h);
       // Check if it already has audio to avoid redundant merge if possible, 
       // but yt-dlp ignores +bestaudio if audio exists.
       videoFormats.push({
          format_id: `${bestMatch.format_id}+bestaudio[ext=m4a]/bestaudio/best`,
          ext: "mp4",
          resolution: `${bestMatch.width ? bestMatch.width + 'x' : ''}${h}`,
          filesize: calculateApproxSize(bestMatch, info.duration),
          fps: bestMatch.fps
       });
    }

    const audioFormats = info.formats
      .filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none')
      .map((f: any) => ({
        format_id: f.format_id,
        ext: f.ext,
        filesize: calculateApproxSize(f, info.duration),
        abr: f.abr
      }));

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader,
      view_count: info.view_count,
      videoFormats,
      audioFormats
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Invalid request" });
  }
};

export const downloadVideo = async (req: Request, res: Response) => {
  try {
    const { url, format, title, thumbnail, duration } = downloadSchema.parse(req.body);

    // Save to history first
    const historyEntry = await prisma.history.create({
      data: {
        title,
        thumbnail,
        url,
        format,
        duration,
        status: "DOWNLOADING"
      }
    });

    // Keep only the 10 most recent history entries
    const historyCount = await prisma.history.count();
    if (historyCount > 10) {
      const recordsToKeep = await prisma.history.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true }
      });
      const idsToKeep = recordsToKeep.map(r => r.id);
      
      await prisma.history.deleteMany({
        where: {
          id: { notIn: idsToKeep }
        }
      });
    }

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = `${crypto.randomUUID()}.mp4`;
    const filepath = path.join(tempDir, filename);

    const ytDlpProcess = downloadToDisk(url, format, filepath);

    if (ytDlpProcess.stderr) {
      ytDlpProcess.stderr.on('data', (data: Buffer) => {
        console.log(`yt-dlp stderr: ${data}`);
      });
    }

    ytDlpProcess.on('close', async (code: number | null) => {
      if (code === 0 && fs.existsSync(filepath)) {
        await prisma.history.update({
          where: { id: historyEntry.id },
          data: { status: "COMPLETED" }
        });

        res.download(filepath, `${title.replace(/[/\\?%*:|"<>]/g, '-')}.mp4`, (err) => {
          if (err) {
            console.error("Error sending file:", err);
          }
          // Clean up the temp file
          try {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }
          } catch (e) {
            console.error("Failed to delete temp file:", e);
          }
        });
      } else {
        await prisma.history.update({
          where: { id: historyEntry.id },
          data: { status: "FAILED" }
        });
        
        // If file exists on failure (partial), delete it
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        } catch (e) {
          // ignore
        }

        if (!res.headersSent) {
           res.status(500).json({ error: "Download or merge failed" });
        }
      }
    });

  } catch (error: any) {
    console.error("Download error:", error);
    res.status(400).json({ error: error.message || "Download failed" });
  }
};
