import { useState, useEffect, useRef } from "react";
import axios from 'axios';

// This component replaces your old SidebarChat.
// It connects DIRECTLY to the Hugging Face service, bypassing the faulty API Gateway.
export default function SidebarChat({ modelOutput }) {
  // State uses the format { type: "human" | "ai", content: "..." } to match the backend
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // The direct URL to your chatbot, fetched from Render's environment variables
  const chatbotApiUrl = import.meta.env.VITE_CHATBOT_SERVICE_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // When the model output is received, display it as the first message from the bot.
  useEffect(() => {
    if (modelOutput && modelOutput.heart_rate) {
      const initialText = `Analysis complete.\nHeart Rate: ${modelOutput.heart_rate} BPM\nBreathing Rate: ${modelOutput.breathing_rate} breaths/min.\n\nHow can I help you interpret these results?`;
      // We create the message in the new, correct format
      const initialMessage = { type: "ai", content: initialText };
      setMessages([initialMessage]);
    } else {
      setMessages([{ type: 'ai', content: "Hello! Once your video is analyzed, I'll provide insights on your results right here." }]);
    }
  }, [modelOutput]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if the environment variable is set
    if (!chatbotApiUrl) {
      console.error("CRITICAL ERROR: VITE_CHATBOT_SERVICE_URL is not configured in your Render frontend environment.");
      setMessages((prev) => [...prev, { type: "ai", content: "Chat service is not configured correctly. Please contact support." }]);
      return;
    }

    const userMessage = { type: "human", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Prepare the history in the format the Python server expects
      const historyPayload = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      // ====================================================================================
      // THE DEFINITIVE FIX:
      // 1. We call the Hugging Face URL directly (chatbotApiUrl).
      // 2. We send the CORRECT payload: { question: ..., history: ... }.
      // 3. We have a long timeout to allow the service to wake up.
      // ====================================================================================
      const res = await axios.post(
        chatbotApiUrl, 
        { 
          question: currentInput,
          history: historyPayload
        },
        { timeout: 60000 } // 60-second timeout for wake-up
      );
      
      const aiMessage = { type: "ai", content: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error("Error sending chat message directly to chatbot:", err);
      setMessages((prev) => [...prev, { type: "ai", content: "Sorry, I'm having trouble connecting. The service might be waking up. Please try again in 30 seconds." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-inner">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'}`}>
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                msg.type === "human"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
              BeatSync is thinking...
            </div>
          </div>
        )}
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
            disabled={!modelOutput || isLoading}
          />
          <button
            type="submit"
            className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-300"
            disabled={!input.trim() || isLoading}
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