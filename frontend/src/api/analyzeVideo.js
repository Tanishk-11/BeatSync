export default async function analyzeVideo(videoBlob) {
  const formData = new FormData();
  formData.append("video", videoBlob, "video.webm");

  try {
    const res = await fetch("http://localhost:8000/api/video/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return { bpm: "Error", breaths: "Error" };
  }
}
