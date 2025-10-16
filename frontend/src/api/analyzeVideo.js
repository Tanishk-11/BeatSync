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


import axios from 'axios';

/**
 * Analyzes the video by sending it to the deployed API Gateway.
 * @param {Blob} videoBlob - The video file to be analyzed.
 * @returns {Promise<object>} - A promise that resolves to the analysis result from the model.
 */
export default async function analyzeVideo(videoBlob) {
  const formData = new FormData();
  formData.append("video", videoBlob, "recording.webm");

  // --- CHANGE IS HERE ---
  // We construct the full URL for the API call.
  // In production, `import.meta.env.VITE_API_URL` will be the URL of your deployed API Gateway (e.g., "https://beatsync-api-gateway.onrender.com").
  // The '/api/video/analyze' is the specific endpoint.
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/video/analyze`;

  const response = await axios.post(apiUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status !== 200) {
    throw new Error("API Gateway failed to analyze video");
  }

  return response.data;
}
