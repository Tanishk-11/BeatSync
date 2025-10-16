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

import axios from "axios";
import FormData from "form-data";

export const analyzeVideo = async (req, res) => {
  // Log that the function has been triggered
  console.log("analyzeVideo controller initiated.");

  try {
    if (!req.file) {
      console.error("Error: No file was received from the frontend.");
      return res.status(400).send("No file uploaded.");
    }

    console.log(`Received file: ${req.file.originalname}, Size: ${req.file.size} bytes`);

    // --- Create and log the forwarding request ---
    const formData = new FormData();
    formData.append("video", req.file.buffer, req.file.originalname);

    const targetUrl = `${process.env.VIDEO_SERVICE_URL}/predict/`;
    const headers = formData.getHeaders();
    
    // THIS IS THE CRITICAL LOGGING STEP
    console.log(`Forwarding video to: ${targetUrl}`);
    console.log("Using headers:", headers);

    const response = await axios.post(targetUrl, formData, {
      headers: headers,
      timeout: 90000, // 90-second timeout for video processing
    });

    console.log("Successfully received response from video service.");
    res.json(response.data);

  } catch (error) {
    // THIS PROVIDES DETAILED ERROR LOGGING
    console.error("--- AXIOS REQUEST FAILED ---");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
    }
    console.error("Full Error Config:", error.config);
    console.error("--- END OF ERROR ---");

    res.status(500).send("An internal error occurred while analyzing the video.");
  }
};
