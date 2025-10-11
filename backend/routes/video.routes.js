// backend/routes/video.routes.js
import express from "express";
import { upload } from "../middlewares/upload.js";
import { processVideo } from "../controllers/video.controller.js";

const router = express.Router();

// POST /api/video/analyze
router.post("/analyze", upload.single("video"), processVideo);

export default router;
