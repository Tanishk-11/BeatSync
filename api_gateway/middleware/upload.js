import multer from "multer";

// Configure multer to store files in memory.
// This is efficient because the API gateway doesn't need to save the file to disk.
// It will just hold the file in memory long enough to stream it to the Python service.
const storage = multer.memoryStorage();

// Initialize multer with the memory storage configuration.
export const upload = multer({ storage: storage });

