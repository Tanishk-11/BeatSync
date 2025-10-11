import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
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
          { href: "#about-deepsync", label: "About Deepsync" },
          { href: "#what-we-do", label: "What We Do" },
          { href: "#how-we-do", label: "How We Do" },
          { href: "#about-us", label: "About Us" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="relative transition-all duration-300 hover:text-red-600 group"
          >
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </nav>
    </header>
  );
}
