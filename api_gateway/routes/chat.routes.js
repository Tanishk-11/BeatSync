import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";

const router = Router();

// Defines the endpoint: POST /api/chat/
// Any POST request to this URL will be handled by the 'handleChat' controller.
router.post("/", handleChat);

export default router;

