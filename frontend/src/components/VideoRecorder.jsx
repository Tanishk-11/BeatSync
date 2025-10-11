import { useRef, useState } from "react";
import Timer from "./Timer.jsx";
import Button from "./Button.jsx";
import analyzeVideo from "../api/analyzeVideo.js";

export default function VideoRecorder() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  const [modelOutput, setModelOutput] = useState(null);

  const handleStart = async () => {
    setRecording(true);
    setStartTimer(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(blob);
    };
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
  };

  const handleTimerComplete = async () => {
    setStartTimer(false);
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());

    // Send video to backend
    if (videoBlob) {
      const output = await analyzeVideo(videoBlob);
      setModelOutput(output);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-lg h-96 bg-black mb-4 rounded-lg"
        autoPlay
        muted
      />
      {!recording && (
        <Button onClick={handleStart}>Start</Button>
      )}
      <Timer start={startTimer} onComplete={handleTimerComplete} />
      {modelOutput && (
        <div className="mt-4">
          <p>BPM: {modelOutput.bpm}</p>
          <p>Breaths/min: {modelOutput.breaths}</p>
        </div>
      )}
    </div>
  );
}
