import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { processVideo } from "../controllers/video.controller.js";

const router = Router();

// Defines the endpoint: POST /api/video/analyze
// 1. It first uses the 'upload.single("video")' middleware to handle the file upload.
//    The string "video" must match the key used in the frontend's FormData.
// 2. After the upload is handled, it calls the 'processVideo' controller function.
router.post("/analyze", upload.single("video"), processVideo);

export default router;

