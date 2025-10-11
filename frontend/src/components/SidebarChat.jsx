import { useState, useEffect } from "react";

export default function SidebarChat({ modelOutput }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Add model output as first message
  useEffect(() => {
    if (modelOutput) {
      setMessages([
        { sender: "model", text: `Model Output: BPM=${modelOutput.bpm}, Breaths=${modelOutput.breaths}` },
      ]);
    }
  }, [modelOutput]);

  const handleSend = () => {
    if (!input) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    // TODO: call RAG API to get response
    setMessages((prev) => [...prev, { sender: "bot", text: "This is a placeholder response from RAG." }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 border-b">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${msg.sender === "user" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 border rounded-l-md"
        />
        <button onClick={handleSend} className="bg-red-500 text-white px-4 rounded-r-md">Send</button>
      </div>
    </div>
  );
}
    