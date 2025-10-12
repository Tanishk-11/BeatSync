import howImage from "../assets/photo1.jpeg"; // Replace with your actual image

export default function HowWeDoSection() {
  return (
    <section
      id="how-we-do"
      className="h-screen flex flex-col md:flex-row items-center justify-center px-8 md:px-20 text-left"
    >
      {/* Left Content */}
      <div className="md:w-1/2 space-y-6 animate-slideUp">
        <h2 className="text-4xl md:text-5xl font-extrabold text-red-600">
          How We Do It
        </h2>
        <p className="text-gray-800 text-lg leading-relaxed">
          Our technology combines <span className="font-medium text-red-500">computer vision </span> 
          and <span className="font-medium text-red-500">remote photoplethysmography (rPPG) </span> 
          to detect minute color variations on the user’s skin captured via camera. 
          These variations correspond to pulse-induced blood flow changes, enabling precise, 
          contactless heart rate estimation.
        </p>

        <p className="text-gray-800 text-lg leading-relaxed">
          The system leverages <span className="font-medium text-red-500">deep learning models </span> 
          to filter noise, enhance signal accuracy, and identify anomalies in real time. 
          Our analytics pipeline ensures reliable results even in variable lighting or motion conditions — 
          delivering hospital-grade insights instantly.
        </p>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fadeIn">
        <img
          src={howImage}
          alt="How We Do It"
          className="w-3/4 max-w-md rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
        />
      </div>
    </section>
  );
}
