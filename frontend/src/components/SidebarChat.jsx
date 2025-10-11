import { useState, useEffect } from "react";

export default function SidebarChat({ modelOutput }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ When modelOutput changes, auto-send it to backend
  useEffect(() => {
    if (modelOutput) {
      const initialMessage = `Model Output: BPM=${modelOutput.bpm}, Breaths=${modelOutput.breaths}`;

      // Add model output message
      setMessages([{ sender: "model", text: initialMessage }]);

      // Auto-send this to backend
      sendToBackend(initialMessage);
    }
  }, [modelOutput]);

  // 🔹 Function to handle sending message to backend
  const sendToBackend = async (messageText) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to reach backend." },
      ]);
    }
  };

  // 🔹 When user types and sends manually
  const handleSend = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    await sendToBackend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 border-b">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${
              msg.sender === "user"
                ? "bg-blue-200 self-end"
                : msg.sender === "model"
                ? "bg-green-200 self-start font-semibold"
                : "bg-gray-200 self-start"
            }`}
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
        <button
          onClick={handleSend}
          className="bg-red-500 text-white px-4 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
