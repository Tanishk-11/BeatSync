export default function AboutUsSection() {
  const teamMembers = [
    {
      name: "Aryan Nahata",
      role: "AIML | BIT Mesra",
      description:
        "",
      image: "",
    },
    {
      name: "Tanishk Singh Thakur",
      role: "AIML | BIT Mesra",
      description:
        "",
      image: "",
    },
    {
      name: "Yash Rai",
      role: "AIML | BIT Mesra",
      description:
        "",
      image: "",
    },
    {
      name: "Tejas Ganesh",
      role: "AIML | BIT Mesra",
      description:
        "",
      image: "",
    },
    {
      name: "Madhur Tandon",
      role: "CSE | BIT Mesra",
      description:
        "",
      image: "",
    },
    {
      name: "Aditya Karn",
      role: "CSE | BIT Mesra",
      description:
        "",
      image: "",
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
