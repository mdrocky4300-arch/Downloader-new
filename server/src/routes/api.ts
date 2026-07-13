import { Router } from "express";
import rateLimit from "express-rate-limit";
import { analyzeVideo, downloadVideo } from "../controllers/downloader.controller";
import { getHistory, deleteHistory } from "../controllers/history.controller";
import { getSettings } from "../controllers/settings.controller";

const router = Router();

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

// History routes
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistory);

// Settings routes
router.get("/settings", getSettings);

export default router;
