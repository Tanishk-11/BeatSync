import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import VideoRecorder from "../components/VideoRecorder.jsx";
import SidebarChat from "../components/SidebarChat.jsx";
import { useState } from "react";

export default function Analyzer() {
  const [modelOutput, setModelOutput] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-8">
          <VideoRecorder setModelOutput={setModelOutput} />
        </main>
        <aside className="w-120 border-l p-4">
          <SidebarChat modelOutput={modelOutput} />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
