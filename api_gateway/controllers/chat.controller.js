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
    //    This makes the code flexible for development and production environments.
    const chatbotServiceUrl = process.env.CHATBOT_SERVICE_URL;
    if (!chatbotServiceUrl) {
      throw new Error("CHATBOT_SERVICE_URL is not defined in the .env file.");
    }

    // 3. Forward the message to the Python chatbot service.
    //    We use axios to make a POST request. The Python service expects a JSON
    //    object with a "message" key.
    const response = await axios.post(`${chatbotServiceUrl}/chat`, {
      message: message,
    });

    // 4. Send the response from the Python service back to the frontend.
    //    The Python service returns a JSON object like { "response": "..." }.
    res.status(200).json(response.data);

  } catch (error) {
    // 5. If anything goes wrong (e.g., the Python service is down),
    //    log the error and send a 500 Internal Server Error response to the frontend.
    console.error("Error calling chatbot service:", error.message);
    res.status(500).json({ error: "Failed to communicate with the chatbot service." });
  }
};

