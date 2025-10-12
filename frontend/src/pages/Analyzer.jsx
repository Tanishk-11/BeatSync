import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import VideoRecorder from "../components/VideoRecorder.jsx";
import SidebarChat from "../components/SidebarChat.jsx";
import { useState } from "react";

export default function Analyzer() {
  const [modelOutput, setModelOutput] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row container mx-auto my-8 gap-8 px-4">
        {/* The main content area */}
        <main className="flex-1">
          {/* Pass the state setter with the correct prop name */}
          <VideoRecorder setModelOutputInParent={setModelOutput} />
        </main>
        {/* The sidebar chat */}
        <aside className="w-full lg:w-96 lg:border-l lg:pl-8">
          <SidebarChat modelOutput={modelOutput} />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
