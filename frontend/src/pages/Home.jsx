import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LandingSection from "../components/LandingSection.jsx";
import AboutSection from "../components/AboutSection.jsx";
import WhatWeDoSection from "../components/WhatWeDoSection.jsx";
import HowWeDoSection from "../components/HowWeDoSection.jsx";
import AboutUsSection from "../components/AboutUsSection.jsx";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Elegant blended gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50 to-white"></div>
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-red-200 rounded-full blur-[160px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-100 rounded-full blur-[120px] opacity-30"></div>

      <div className="relative z-10">
      <Header />
      <LandingSection />
      <AboutSection />
      <WhatWeDoSection />
      <HowWeDoSection />
      <AboutUsSection />
      <Footer />
    </div>
    </div>
  );
}
