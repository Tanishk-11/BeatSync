import image from "../assets/photo2.jpeg"; // replace with your image file

export default function AboutSection() {
  return (
    <section
      id="about-beatsync"
      className="h-screen flex flex-col md:flex-row items-center justify-center px-8 md:px-20 text-left"
    >
      {/* Left Content */}
      <div className="md:w-1/2 space-y-6 animate-slideUp">
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600">
          About Beatsync
        </h2>
        <p className="text-gray-800 text-lg leading-relaxed">
          <span className="font-semibold text-red-500">BeatSync AI</span> is a
          cutting-edge web platform that transforms any regular smartphone or
          laptop camera into a{" "}
          <span className="font-medium">remote heart health monitor</span>.
          Through advanced computer vision and rPPG (remote photoplethysmography),
          it analyzes subtle facial color variations to calculate real-time
          heart rate — completely contactless.
        </p>
        <p className="text-gray-800 text-lg leading-relaxed">
          It also provides{" "}
          <span className="font-medium text-red-500">
            AI-powered anomaly detection
          </span>{" "}
          to identify potential irregularities like arrhythmia or tachycardia,
          enabling proactive health tracking and early intervention — all from
          your browser.
        </p>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fadeIn">
        <img
          src={image}
          alt="About Deepsync"
          className="w-3/4 max-w-md rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
        />
      </div>
    </section>
  );
}
