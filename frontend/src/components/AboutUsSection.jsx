export default function AboutUsSection() {
  const teamMembers = [
    {
      name: "Aryan Nahata",
      role: "AI & Web Developer",
      description:
        "Specializes in deep learning and full-stack development, leading AI model integration and system architecture.",
      image: "/images/team/aryan.jpg",
    },
    {
      name: "Tanishk Singh Thakur",
      role: "Frontend Developer",
      description:
        "Focuses on building intuitive and responsive user interfaces with React, TailwindCSS, and modern design principles.",
      image: "/images/team/moksh.jpg",
    },
    {
      name: "Yash Rai",
      role: "Backend Developer",
      description:
        "Manages FastAPI backend services, API integration, and database optimization for smooth data flow and security.",
      image: "/images/team/siddhant.jpg",
    },
    {
      name: "Tejas Ganesh",
      role: "Research & ML Engineer",
      description:
        "Handles model experimentation and validation, ensuring high accuracy in rPPG signal extraction and heart rate prediction.",
      image: "/images/team/sanyati.jpg",
    },
    {
      name: "Madhur Tandon",
      role: "UI/UX Designer",
      description:
        "Designs seamless user experiences and ensures visual consistency across the platform with user-centered design.",
      image: "/images/team/siddhi.jpg",
    },
    {
      name: "Aditya Karn",
      role: "Project & Integration Lead",
      description:
        "Oversees coordination, testing, and deployment — ensuring all modules integrate flawlessly for a unified product.",
      image: "/images/team/aryan_sharma.jpg",
    },
  ];

  return (
    <section
      id="about-us"
      className="py-20 px-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">About Us</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          We are a passionate team of developers and researchers dedicated to democratizing
          cardiovascular health monitoring through AI-powered innovation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 mx-auto object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-indigo-600 font-medium mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
