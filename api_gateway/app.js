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
// THE FIX: Replace the simple cors() setup with a specific configuration
// that explicitly allows your deployed frontend to make requests.
// ====================================================================================
const allowedOrigins = ['https://beatsync-frontend.onrender.com', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
// This ensures that browser preflight requests (OPTIONS) are handled correctly.
app.options('*', cors(corsOptions));
// ====================================================================================


// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());


// --- API Routes ---
// Any request starting with /api/video will be handled by the videoRoutes router.
app.use("/api/video", videoRoutes);

// Any request starting with /api/chat will be handled by the chatRoutes router.
app.use("/api/chat", chatRoutes);


// --- Health Check Route ---
// A simple route to check if the API gateway is running.
app.get("/", (req, res) => {
  res.send("BeatSync API Gateway is running ❤️");
});

export default app;
