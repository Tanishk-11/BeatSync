// backend/controllers/video.controller.js
import { callModelService } from "../utils/callModelService.js";
import { deleteTemp } from "../utils/deleteTemp.js";

export const processVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded" });
    }

    // File path of uploaded video
    const videoPath = req.file.path;

    // Call the Python AI service (mocked for now)
    const result = await callModelService(videoPath);

    // Delete video after processing
    await deleteTemp(videoPath);

    res.status(200).json({
      success: true,
      message: "Heart rate extracted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process video",
      error: error.message,
    });
  }
};
