// backend/utils/deleteTemp.js
import fs from "fs";

export const deleteTemp = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🧹 Deleted temp file:", filePath);
    }
  } catch (error) {
    console.error("Error deleting temp file:", error.message);
  }
};
