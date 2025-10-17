from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from BeatSync import ask_question
from fastapi.middleware.cors import CORSMiddleware  # <-- IMPORT THIS

app = FastAPI()

# ====================================================================================
# FIX: Add CORS middleware to allow requests from your frontend.
# This block tells your Hugging Face server to accept API calls
# from your Render frontend.
# ====================================================================================
origins = [
    "https://beatsync-vx53.onrender.com",  # Your deployed frontend
    "http://localhost:5173",         # For local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# ====================================================================================


class ChatRequest(BaseModel):
    question: str
    history: list = []


class ChatResponse(BaseModel):
    answer: str


@app.get("/")
def read_root():
    return {"message": "BeatSync Chatbot is running"}


@app.post("/", response_model=ChatResponse)
def get_chat_response(request: ChatRequest):
    """
    Handles a user's chat message, processes it with the RAG chain,
    and returns the model's response.
    """
    try:
        # Pass the question and the history to the stateless RAG chain function
        answer = ask_question(question=request.question, history=request.history)
        return ChatResponse(answer=answer)
    except Exception as e:
        # Log the exception for debugging
        print(f"An error occurred: {e}")
        # Return a user-friendly error message
        raise HTTPException(status_code=500, detail="An internal error occurred in the chatbot.")