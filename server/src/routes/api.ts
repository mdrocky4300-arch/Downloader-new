import { Router } from "express";
import rateLimit from "express-rate-limit";
import { analyzeVideo, downloadVideo } from "../controllers/downloader.controller";
import { getHistory, deleteHistory, clearAllHistory } from "../controllers/history.controller";
import { getSettings } from "../controllers/settings.controller";

import multer from "multer";
import { convertLocalFile } from "../controllers/converter.controller";

const router = Router();

const upload = multer({ 
  dest: "temp/",
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

router.use(apiLimiter);

// Downloader routes
router.post("/analyze", analyzeVideo);
router.post("/download", downloadVideo);

// File Converter route
router.post("/convert", upload.single("video"), convertLocalFile);

// History routes
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistory);
router.delete("/history", clearAllHistory);

// Settings routes
router.get("/settings", getSettings);

export default router;
