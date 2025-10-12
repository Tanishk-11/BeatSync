from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import logging

# Local import from your RAG logic file
from BeatSync import ask_question

# --- Basic Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BeatSync RAG Chatbot Service",
    description="A dedicated API to interact with the Groq-powered RAG model.",
    version="1.0.0"
)

# --- Pydantic Models for Request/Response ---
# This ensures the data sent to and from the API is in the correct format.
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# --- API Endpoint Definition ---
@app.post("/chat/", response_model=ChatResponse)
async def handle_chat_message(request: ChatRequest):
    """
    This endpoint receives a user's message, passes it to the RAG chain,
    and returns the generated response.
    """
    try:
        logger.info(f"Received question: '{request.message}'")
        
        # Call the core RAG logic from BeatSync.py
        answer = ask_question(request.message)
        
        logger.info(f"Generated response: '{answer}'")
        
        return ChatResponse(response=answer)
        
    except Exception as e:
        # Catch any unexpected errors from the LangChain or Groq API calls
        logger.exception(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred while processing the chat message."
        )

# --- Health Check Endpoint ---
@app.get("/")
def read_root():
    """A simple health check endpoint to confirm the service is running."""
    return {"status": "Chatbot Service is running"}

# --- To run this server locally for testing ---
# Use the command: uvicorn server:app --host 0.0.0.0 --port 8001 --reload
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

