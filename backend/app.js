// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import videoRoutes from "./routes/video.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/video", videoRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("HeartSense backend is running ❤️");
});

export default app;
