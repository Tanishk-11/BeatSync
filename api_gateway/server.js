// backend/server.js

import app from "./app.js";     // Import the Express app
import dotenv from "dotenv";

dotenv.config();               // Load environment variables from .env

// Set port from .env or default to 8000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HeartSense backend running on http://localhost:${PORT}`);
});
