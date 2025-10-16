// import axios from 'axios';

// /**
//  * Analyzes the video by sending it to the API Gateway.
//  * The gateway will then forward the request to the Python video model service.
//  * @param {Blob} videoBlob - The video file to be analyzed.
//  * @returns {Promise<object>} - A promise that resolves to the analysis result from the model.
//  */
// export default async function analyzeVideo(videoBlob) {
//   const formData = new FormData();
//   // The key 'video' must match what the backend (Multer in api_gateway) expects.
//   formData.append("video", videoBlob, "recording.webm");

//   // The request now goes to our API gateway's relative path.
//   // Vite's proxy will redirect this to http://localhost:3000/api/video/analyze during development.
//   const response = await axios.post("/api/video/analyze", formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });

//   if (response.status !== 200) {
//     throw new Error("API Gateway failed to analyze video");
//   }

//   return response.data;
// }


// import axios from 'axios';

// /**
//  * Analyzes the video by sending it to the deployed API Gateway.
//  * @param {Blob} videoBlob - The video file to be analyzed.
//  * @returns {Promise<object>} - A promise that resolves to the analysis result from the model.
//  */
// export default async function analyzeVideo(videoBlob) {
//   const formData = new FormData();
//   formData.append("video", videoBlob, "recording.webm");

//   // --- CHANGE IS HERE ---
//   // We construct the full URL for the API call.
//   // In production, `import.meta.env.VITE_API_URL` will be the URL of your deployed API Gateway (e.g., "https://beatsync-api-gateway.onrender.com").
//   // The '/api/video/analyze' is the specific endpoint.
//   const apiUrl = `${import.meta.env.VITE_API_URL}/api/video/analyze`;

//   const response = await axios.post(apiUrl, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });

//   if (response.status !== 200) {
//     throw new Error("API Gateway failed to analyze video");
//   }

//   return response.data;
// }


import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME; // <-- IMPORTANT: SET THIS
const CLOUDINARY_API_KEY = import.meta.env.CLOUDINARY_API_KEY; // <-- IMPORTANT: SET THIS

const analyzeVideo = async (videoBlob) => {
  try {
    // --- Step 1: Get the secure signature from our API Gateway ---
    const signatureResponse = await axios.get(`${API_URL}/api/video/get-upload-signature`);
    const { timestamp, signature } = signatureResponse.data;

    // --- Step 2: Upload the video directly to Cloudinary ---
    const formData = new FormData();
    formData.append("file", videoBlob);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    // Optional: folder to keep things organized in Cloudinary
    formData.append("folder", "beatsync_videos"); 

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
    const cloudinaryResponse = await axios.post(cloudinaryUrl, formData);
    const videoUrl = cloudinaryResponse.data.secure_url; // The public URL of the uploaded video

    // --- Step 3: Trigger the analysis on our backend ---
    const analysisResponse = await axios.post(`${API_URL}/api/video/analyze`, { videoUrl });
    
    return analysisResponse.data;

  } catch (error) {
    console.error("Error during video analysis pipeline:", error);
    throw error;
  }
};

export default analyzeVideo;