export default async function analyzeVideo(videoBlob) {
  const formData = new FormData();
  formData.append("file", videoBlob, "recording.webm");

  const response = await fetch("http://127.0.0.1:8000/analyze_video/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze video");
  }

  return await response.json();
}