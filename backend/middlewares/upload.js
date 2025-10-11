// backend/middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter — only allow video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/mov", "video/avi", "video/mpeg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only video files are allowed!"), false);
};

export const upload = multer({ storage, fileFilter });
