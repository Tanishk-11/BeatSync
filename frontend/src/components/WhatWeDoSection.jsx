import whatImage from "../assets/logo.png"; // Replace with your actual image

export default function WhatWeDoSection() {
  return (
    <section
      id="what-we-do"
      className="h-screen flex flex-col md:flex-row items-center justify-center px-8 md:px-20 text-left relative overflow-hidden"
    >
      {/* Subtle background shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-100 opacity-90"></div>
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-red-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-100 rounded-full blur-2xl opacity-40"></div>

      {/* Left Image */}
      <div className="md:w-1/2 flex justify-center relative z-10 animate-fadeIn">
        <img
          src={whatImage}
          alt="What We Do"
          className="w-3/4 max-w-md rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Right Text */}
      <div className="md:w-1/2 mt-10 md:mt-0 space-y-6 relative z-10 animate-slideUp">
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600">
          What We Do
        </h2>
        <p className="text-gray-800 text-lg leading-relaxed">
          <span className="font-semibold text-red-500">HeartSense AI</span> bridges
          the healthcare accessibility gap by enabling
          <span className="font-medium"> real-time, contactless heart monitoring</span> 
          through everyday devices. Using just a smartphone camera, users can
          assess cardiovascular health without any external sensors or cost.
        </p>
        <p className="text-gray-800 text-lg leading-relaxed">
          We focus on empowering underserved and rural populations, telemedicine
          providers, and elderly individuals — making preventive heart health
          screening universally accessible and scalable.
        </p>
      </div>
    </section>
  );
}
