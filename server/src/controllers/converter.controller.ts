import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { convertVideoToAudio } from "../services/converter.service";
import crypto from "crypto";

export const convertLocalFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const baseName = path.parse(originalName).name;
    const outputFilename = `${baseName}_${crypto.randomUUID().slice(0, 8)}.mp3`;
    const tempDir = path.join(process.cwd(), "temp");
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const outputPath = path.join(tempDir, outputFilename);

    // Convert
    await convertVideoToAudio(inputPath, outputPath);

    // Send file
    res.download(outputPath, `${baseName}.mp3`, (err) => {
      // Cleanup
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });

  } catch (error: any) {
    console.error("Conversion error:", error);
    // Cleanup input if exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || "Failed to convert file" });
  }
};
