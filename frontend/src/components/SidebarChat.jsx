// import { useState, useEffect } from "react";

// export default function SidebarChat({ modelOutput }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   // ✅ When modelOutput changes, auto-send it to backend
//   useEffect(() => {
//     if (modelOutput) {
//       const initialMessage = `Model Output: BPM=${modelOutput.bpm}, Breaths=${modelOutput.breaths}`;

//       // Add model output message
//       setMessages([{ sender: "model", text: initialMessage }]);

//       // Auto-send this to backend
//       sendToBackend(initialMessage);
//     }
//   }, [modelOutput]);

//   // 🔹 Function to handle sending message to backend
//   const sendToBackend = async (messageText) => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: messageText }),
//       });

//       const data = await res.json();
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: data.response },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Error: Unable to reach backend." },
//       ]);
//     }
//   };

//   // 🔹 When user types and sends manually
//   const handleSend = async () => {
//     if (!input) return;

//     setMessages((prev) => [...prev, { sender: "user", text: input }]);
//     await sendToBackend(input);
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-2 space-y-2 border-b">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded-md ${
//               msg.sender === "user"
//                 ? "bg-blue-200 self-end"
//                 : msg.sender === "model"
//                 ? "bg-green-200 self-start font-semibold"
//                 : "bg-gray-200 self-start"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="mt-2 flex">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask something..."
//           className="flex-1 p-2 border rounded-l-md"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-red-500 text-white px-4 rounded-r-md"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




import { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default function SidebarChat({ modelOutput }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // When the model output is received, display it as the first message from the bot.
  useEffect(() => {
    if (modelOutput && modelOutput.heart_rate) {
      const initialText = `Analysis complete.\nHeart Rate: ${modelOutput.heart_rate} BPM\nBreathing Rate: ${modelOutput.breathing_rate} breaths/min.\n\nHow can I help you interpret these results?`;
      const initialMessage = { sender: "bot", text: initialText };
      setMessages([initialMessage]);
    }
  }, [modelOutput]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");

    try {
      // --- THIS IS THE CORRECTED LINE ---
      // Send the request to the relative API Gateway endpoint.
      // Vite proxies this to http://localhost:3000/api/chat
      const res = await axios.post("/api/chat", { message: currentInput });
      
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.response }]);
    } catch (err) {
      console.error("Error sending chat message:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-inner">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              style={{ whiteSpace: 'pre-wrap' }} // Ensures newlines (\n) are rendered
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                msg.sender === "user"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center bg-white rounded-lg border focus-within:ring-2 focus-within:ring-red-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your results..."
            className="flex-1 p-2 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-300"
            disabled={!input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}