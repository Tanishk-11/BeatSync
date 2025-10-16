// import axios from "axios";
// import FormData from "form-data";

// // This is the controller function that handles the logic for the /api/video/analyze endpoint.
// export const processVideo = async (req, res) => {
//   try {
//     // 1. Check if a file was actually uploaded. The 'upload' middleware places
//     //    the file details in req.file.
//     if (!req.file) {
//       return res.status(400).json({ error: "No video file uploaded." });
//     }

//     // 2. Get the URL of the Python video model service from environment variables.
//     //    This is crucial for switching between development and production.
//     const videoServiceUrl = process.env.VIDEO_SERVICE_URL;
//     if (!videoServiceUrl) {
//       throw new Error("VIDEO_SERVICE_URL is not defined in the .env file.");
//     }

//     // 3. Create a new FormData object to send the file to the Python service.
//     //    This is necessary because the Python service expects 'multipart/form-data'.
//     const form = new FormData();

//     // 4. Append the video file from memory to the form data.
//     //    - `req.file.buffer` contains the file data held in memory by multer.
//     //    - `req.file.originalname` is the original name of the file.
//     //    - The key 'file' must match what the FastAPI server expects in its endpoint.
//     form.append("file", req.file.buffer, {
//       filename: req.file.originalname,
//     });

//     // 5. Forward the request to the Python video service using axios.
//     //    - The URL is constructed from the .env variable.
//     //    - The 'form' object is sent as the request body.
//     //    - The headers from the 'form-data' library are included to set the correct
//     //      'Content-Type' and boundaries for the multipart request.
//     const response = await axios.post(`${videoServiceUrl}/analyze_video/`, form, {
//       headers: form.getHeaders(),
//     });

//     // 6. Send the successful response from the Python service back to the frontend.
//     res.status(200).json(response.data);

//   } catch (error) {
//     // 7. If any part of the process fails (e.g., Python service is offline),
//     //    log the detailed error and send a generic 500 error to the frontend.
//     console.error("Error processing video:", error.message);
//     res.status(500).json({ error: "Failed to process the video." });
//   }
// };

const axios = require("axios");
const FormData = require("form-data");

export const analyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // 1. Create a new FormData instance to forward the request.
    const formData = new FormData();

    // 2. Append the video buffer directly.
    // We give it a name ("video") that matches what the Python backend expects.
    formData.append("video", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // 3. Make the request to the video model service.
    // We let axios handle the headers automatically by passing the formData object.
    // A longer timeout is added for robustness, as video processing can take time.
    const response = await axios.post(
      `${process.env.VIDEO_SERVICE_URL}/predict/`,
      formData,
      {
        headers: formData.getHeaders(), // Let the form-data library generate the correct headers
        timeout: 60000, // 60-second timeout
      }
    );

    // 4. Send the prediction results back to the frontend.
    res.json(response.data);

  } catch (error) {
    // Log detailed error information for easier debugging
    console.error(
      "Error forwarding video to service:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("An internal error occurred while processing the video.");
  }
};
