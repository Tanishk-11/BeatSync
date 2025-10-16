import { Router } from "express";
import { getUploadSignature, analyzeVideo } from "../controllers/video.controller.js";

const router = Router();

// Route for the frontend to get the secure upload signature
router.route("/get-upload-signature").get(getUploadSignature);

// Route for the frontend to trigger analysis AFTER uploading
router.route("/analyze").post(analyzeVideo);

export default router;