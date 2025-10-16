import { Router } from "express";
import { upload } from "../middleware/upload.js";
// 1. Correct the import name here
import { analyzeVideo } from "../controllers/video.controller.js";

const router = Router();

// 2. Correct the function name used in the route handler
router.route("/analyze").post(upload.single("video"), analyzeVideo);

export default router;