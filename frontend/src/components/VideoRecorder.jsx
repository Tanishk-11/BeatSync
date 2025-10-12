import { useRef, useState, useEffect } from "react";
import Timer from "./Timer.jsx";
import Button from "./Button.jsx";
import ModelOutput from "./ModelOutput.jsx"; // To display the output directly
import analyzeVideo from "../api/analyzeVideo.js";

// This prop is passed down from Analyzer.jsx
export default function VideoRecorder({ setModelOutputInParent }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]); // Use a ref to store chunks to avoid re-renders

  const [status, setStatus] = useState("idle"); // 'idle', 'recording', 'processing', 'completed', 'error'
  const [error, setError] = useState("");
  const [localModelOutput, setLocalModelOutput] = useState(null);

  const handleStartRecording = async () => {
    // Reset previous state
    setStatus("recording");
    setError("");
    setLocalModelOutput(null);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = recorder;

      // When data is available, add it to our chunks array
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // This is the most important part:
      // When the recorder stops, assemble the blob and immediately upload it.
      recorder.onstop = async () => {
        setStatus("processing");
        const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });

        // --- DIRECT UPLOAD ---
        // No more waiting for useEffect. We call the analysis function right here.
        try {
          const output = await analyzeVideo(videoBlob);
          setLocalModelOutput(output);
          setModelOutputInParent(output); // Update the parent component (Analyzer.jsx)
          setStatus("completed");
        } catch (err) {
          console.error("Error during video analysis:", err);
          setError("Analysis failed. Please try again.");
          setStatus("error");
        }

        // Clean up the camera stream
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      };

      recorder.start();
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setStatus("error");
    }
  };

  const handleTimerComplete = () => {
    // When the timer finishes, just stop the recorder.
    // The 'onstop' event handler will take care of the rest.
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case "recording":
        return <p className="text-lg text-gray-700">Recording in progress... Please face the camera.</p>;
      case "processing":
        return <p className="text-lg text-blue-600">Processing video... This may take a moment.</p>;
      case "completed":
        return <p className="text-lg text-green-600">Analysis complete!</p>;
      case "error":
        return <p className="text-lg text-red-600">Error: {error}</p>;
      default:
        return <p className="text-lg text-gray-500">Click "Start Recording" to begin the 30-second analysis.</p>;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Vital Signs Analysis</h2>
      <div className="w-full h-96 bg-black mb-4 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
        />
      </div>

      <div className="mb-4 w-full text-center">
        {renderStatusMessage()}
      </div>

      {status !== 'recording' && (
        <Button onClick={handleStartRecording} disabled={status === 'processing'}>
          {status === 'processing' ? 'Processing...' : 'Start Recording'}
        </Button>
      )}
      
      <Timer start={status === "recording"} onComplete={handleTimerComplete} />

      {/* Display the final output here */}
      {status === 'completed' && localModelOutput && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 w-full">
            <h3 className="text-xl font-bold mb-2 text-gray-700">Analysis Result</h3>
            <p className="text-lg">Heart Rate: <span className="font-bold text-red-600">{localModelOutput.heart_rate}</span> BPM</p>
            <p className="text-lg">Breathing Rate: <span className="font-bold text-blue-600">{localModelOutput.breathing_rate}</span> breaths/min</p>
        </div>
      )}
    </div>
  );
}
