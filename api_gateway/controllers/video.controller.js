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

// -----------------------------------------------------------

// import axios from "axios";
// import FormData from "form-data";

// export const analyzeVideo = async (req, res) => {
//   try {
//     // 1. Immediately check if the file exists.
//     if (!req.file) {
//       console.error("API Gateway Error: No file was received by multer.");
//       return res.status(400).send("No file uploaded.");
//     }

//     // 2. Create the form data for forwarding.
//     const formData = new FormData();

//     // 3. Append the file buffer from memory.
//     // The key 'video' must exactly match what the Python backend expects.
//     formData.append("video", req.file.buffer, req.file.originalname);

//     // 4. Make the request to the video service. This is the critical part.
//     const response = await axios.post(
//       `${process.env.VIDEO_SERVICE_URL}/predict/`,
//       formData,
//       {
//         // This line is the solution: it automatically generates the
//         // precise 'Content-Type: multipart/form-data; boundary=...'
//         // header that the backend server needs to understand the file.
//         headers: {
//           ...formData.getHeaders(),
//         },
//         // A long timeout is essential, as the model can take time to run.
//         timeout: 90000, // 90 seconds
//       }
//     );

//     // 5. Send the successful result back to the frontend.
//     res.json(response.data);

//   } catch (error) {
//     // This will log the true error to your Render logs for diagnosis.
//     console.error(
//       "API Gateway Crash:",
//       error.response ? error.response.data : error.message
//     );
//     res
//       .status(500)
//       .send("An internal error occurred while analyzing the video.");
//   }
// };


import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This function generates the secure, temporary URL for the frontend to use
export const getUploadSignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "beatsync_videos"; // The folder we will upload to

    // --- THIS IS THE FIX ---
    // The signature must be generated from ALL parameters that will be sent
    // in the upload request (except the file itself and api_key).
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder, // Including the folder in the signature
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature and timestamp back to the frontend
    res.json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).send("Could not prepare video upload.");
  }
};

// This function is called AFTER the frontend has uploaded the video
export const analyzeVideo = async (req, res) => {
  try {
    // The frontend will now send a JSON body with the video's public URL
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).send("No video URL provided.");
    }

    // Forward the URL to the video model service
    const response = await axios.post(
      `${process.env.VIDEO_SERVICE_URL}/predict/`,
      { video_url: videoUrl } // Send as JSON, not a file
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding analysis request:", error.response ? error.response.data : error.message);
    res.status(500).send("An error occurred during video analysis.");
  }
};  