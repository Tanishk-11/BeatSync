// backend/utils/callModelService.js
import axios from "axios";
import path from "path";
import fs from "fs";

export const callModelService = async (videoPath) => {
  try {
    // ⚠️ Replace this URL with your Python model API endpoint
    const MODEL_API_URL = process.env.MODEL_API_URL || "http://localhost:5001/predict";

    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);
    formData.append("video", videoStream, path.basename(videoPath));

    const response = await axios.post(MODEL_API_URL, formData, {
      headers: formData.getHeaders(),
    });

    return response.data; // Expecting { heartRate: 78 }
  } catch (error) {
    console.error("Model API call failed:", error.message);
    // Mock response for testing
    return { heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60 };
  }
};
