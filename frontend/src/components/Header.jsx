import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Smoothly scroll to a specific section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle navigation to section (even from another page)
  const handleSectionClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 250);
    } else {
      scrollToSection(sectionId);
    }
  };

  // Clicking logo → back to landing section
  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection("landing-section"), 250);
    } else {
      scrollToSection("landing-section");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Logo Section */}
      <div
        onClick={handleLogoClick}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <img
          src={logo}
          alt="BeatSync Logo"
          className="h-10 w-10 transition-transform duration-300 hover:scale-110"
        />
        <span className="font-extrabold text-2xl text-red-600 tracking-tight">
          BeatSync
        </span>
      </div>

      {/* Navigation Section */}
      <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
        {[
          { id: "about-beatsync", label: "About Beatsync" },
          { id: "what-we-do", label: "What We Do" },
          { id: "how-we-do", label: "How We Do" },
          { id: "about-us", label: "About Us" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            className="relative transition-all duration-300 hover:text-red-600 group"
          >
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </nav>
    </header>
  );
}
