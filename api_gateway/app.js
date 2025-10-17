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

// ====================================================================================
// THE FIX: A simpler, more direct, and production-standard CORS configuration.
// Instead of a function, we provide a direct list of trusted websites.
// ====================================================================================
// const corsOptions = {
//   origin: [
//     'https://beatsync-vx53.onrender.com', // Your deployed frontend
//     'http://localhost:5173'                     // Your local development environment
//   ],
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// };

const corsOptions = {
  origin: [
    "https://beatsync-vx53.onrender.com", // your frontend (Render)
    "http://localhost:5173"               // local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // <- ensures old browsers don't break on 204
};

// The cors middleware, with these options, will correctly handle all requests,
// including the browser's preflight (OPTIONS) security checks.
app.use(cors(corsOptions));
// ====================================================================================


// Enable the Express app to parse JSON formatted request bodies.
// This must come AFTER the CORS middleware.
app.use(express.json());


// --- API Routes ---
// Any request starting with /api/video will be handled by the videoRoutes router.
app.use("/api/video", videoRoutes);

// Any request starting with /api/preflight will be handled by the chatRoutes router.
app.use("/api/chat", chatRoutes);


// --- Health Check Route ---
// A simple route to check if the API gateway is running.
app.get("/", (req, res) => {
  res.send("BeatSync API Gateway is running ❤️");
});

export default app;

