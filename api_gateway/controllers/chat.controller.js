import axios from "axios";

// This is the controller function that handles the logic for the /api/chat endpoint.
export const handleChat = async (req, res) => {
  try {
    // 1. Extract the user's message from the incoming request body.
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 2. Get the URL of the Python chatbot service from environment variables.
    const chatbotServiceUrl = process.env.CHATBOT_SERVICE_URL;
    if (!chatbotServiceUrl) {
      console.error("CHATBOT_SERVICE_URL is not defined in the .env file.");
      return res.status(500).json({ error: "Chatbot service is not configured on the server." });
    }

    // 3. Forward the message to the Python chatbot service.
    // ====================================================================================
    // FIX 1: The Python server expects the endpoint at the root "/", not "/chat".
    // FIX 2: The Python server expects the JSON key to be "query", not "message".
    // ====================================================================================
    const response = await axios.post(chatbotServiceUrl, { // REMOVED '/chat'
      query: message, // CHANGED key from 'message' to 'query'
    });

    // 4. Send the response from the Python service back to the frontend.
    res.status(200).json(response.data);

  } catch (error) {
    // 5. Improved error handling to provide more detail in the logs.
    console.error("Error calling chatbot service:", error.message);
    if (error.response) {
      // If the chatbot service itself returned an error (e.g., 4xx, 5xx)
      console.error("Chatbot service error status:", error.response.status);
      console.error("Chatbot service error data:", error.response.data);
    }
    res.status(500).json({ error: "Failed to communicate with the chatbot service." });
  }
};
