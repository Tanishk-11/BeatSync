import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import logo from "../assets/logo.png";

export default function LandingSection() {
  const navigate = useNavigate();

  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="BeatSync Logo"
        className="h-32 mb-6 drop-shadow-lg transition-transform duration-500 hover:scale-110 animate-fadeIn"
      />

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-red-600 mb-4 tracking-tight animate-slideUp">
        Welcome to BeatSync
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl animate-fadeIn delay-200">
        AI-powered real-time heart rate & respiration monitoring
      </p>

      {/* CTA Button */}
      <div className="mb-4 flex flex-col sm:flex-row gap-10">
      <Button
        onClick={() => navigate("/analyzer")}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
      >
        Start Analysis
      </Button>
      <Button
        onClick={() => navigate("/dashboard")}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
      >
        Dashbaord
      </Button>
      </div>
    </section>
  );
}
