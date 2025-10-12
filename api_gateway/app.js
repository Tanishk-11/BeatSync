import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import the route handlers for both services
import videoRoutes from "./routes/video.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Load environment variables from the .env file
dotenv.config();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so the frontend can communicate with this gateway
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());


// --- API Routes ---
// Any request starting with /api/video will be handled by the videoRoutes router.
app.use("/api/video", videoRoutes);

// Any request starting with /api/chat will be handled by the chatRoutes router.
app.use("/api/chat", chatRoutes);


// --- Health Check Route ---
// A simple route to check if the API gateway is running.
// You can visit this in your browser at http://localhost:3000/
app.get("/", (req, res) => {
  res.send("BeatSync API Gateway is running ❤️");
});

export default app;

