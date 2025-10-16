import multer from "multer";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Set a file size limit (e.g., 100 MB)
const limits = {
  fileSize: 100 * 1024 * 1024, // 100 MB in bytes
};

// Initialize multer with storage and limits
export const upload = multer({
  storage: storage,
  limits: limits,
});
