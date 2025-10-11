export default function ModelOutput({ output }) {
  if (!output) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Analysis Result</h2>
      <p>BPM: {output.bpm}</p>
      <p>Breaths/min: {output.breaths}</p>
      <div className="mt-2">
        <canvas id="rppg-signal" className="w-full h-32 bg-white border"></canvas>
        {/* Later, use Chart.js or similar to render rPPG signal */}
      </div>
    </div>
  );
}
