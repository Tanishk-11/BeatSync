# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from predict_vitals import predict_vitals
# import shutil
# import os

# app = FastAPI()

# origins = [
#     "http://localhost:5173" # frontend in development # your production frontend
# ]


# # ✅ Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Or restrict to ["http://localhost:5173"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/analyze_video/")
# async def analyze_video(file: UploadFile = File(...)):
#     try:
#         temp_dir = "uploads"
#         os.makedirs(temp_dir, exist_ok=True)
#         temp_path = os.path.join(temp_dir, file.filename)

#         with open(temp_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         result = predict_vitals(video_path=temp_path)

#         os.remove(temp_path)
#         print("Video received:", temp_path)
#         print("Model output:", result)


#         return result

#     except Exception as e:
#         return {"error": str(e)}










# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.responses import JSONResponse
# import uvicorn
# import shutil
# import os
# import uuid
# import logging
# from predict_vitals import predict_vitals

# # --- Basic Configuration ---
# # Set up a logger for better debugging and monitoring in production
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Create the FastAPI app instance
# app = FastAPI(
#     title="BeatSync Vital Signs Model Service",
#     description="A dedicated API to analyze video files and extract heart rate and breathing rate using the MTTS-CAN model.",
#     version="1.0.0"
# )

# # Define the directory to store temporary video files
# TEMP_DIR = "temp_videos"
# os.makedirs(TEMP_DIR, exist_ok=True)

# # --- API Endpoint Definition ---
# @app.post("/analyze_video/")
# async def analyze_video(file: UploadFile = File(...)):
#     """
#     This endpoint accepts a video file, processes it to predict vital signs
#     (heart rate and breathing rate), and returns the results.
#     """
#     # Create a unique filename to prevent conflicts if multiple users upload at once
#     unique_filename = f"{uuid.uuid4()}_{file.filename}"
#     temp_video_path = os.path.join(TEMP_DIR, unique_filename)

#     try:
#         # --- 1. Save the uploaded video to a temporary file ---
#         logger.info(f"Receiving file: {file.filename}")
#         with open(temp_video_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         logger.info(f"File saved temporarily to: {temp_video_path}")

#         # --- 2. Call the core prediction logic from predict_vitals.py ---
#         logger.info("Starting vital signs prediction...")
#         # The predict_vitals function will handle preprocessing and model inference
#         result = predict_vitals(video_path=temp_video_path)
#         logger.info(f"Prediction successful. Result: {result}")

#         # --- 3. Validate the model's output ---
#         # Ensure the result is a dictionary and contains the expected keys
#         if not isinstance(result, dict) or "heart_rate" not in result or "breathing_rate" not in result:
#             logger.error(f"Invalid output format from model: {result}")
#             raise HTTPException(
#                 status_code=500,
#                 detail="Model produced an unexpected output format."
#             )
        
#         # --- 4. Return the successful result ---
#         return JSONResponse(
#             status_code=200,
#             content=result
#         )

#     except (IOError, ValueError, HTTPException) as e:
#         # Catch specific, known errors (e.g., video too short, no face detected)
#         logger.error(f"A known error occurred during processing: {e}")
#         # Forward the specific error message to the client
#         raise HTTPException(status_code=400, detail=str(e))
    
#     except Exception as e:
#         # Catch any other unexpected errors during the process
#         logger.exception(f"An unexpected error occurred for file {file.filename}: {e}")
#         # Return a generic 500 Internal Server Error to hide implementation details
#         raise HTTPException(
#             status_code=500,
#             detail="An internal server error occurred during video analysis."
#         )

#     finally:
#         # --- 5. Clean up the temporary file ---
#         # This block ensures the temporary video is deleted, even if an error occurred.
#         if os.path.exists(temp_video_path):
#             os.remove(temp_video_path)
#             logger.info(f"Cleaned up temporary file: {temp_video_path}")

# # --- Health Check Endpoint ---
# @app.get("/")
# def read_root():
#     """A simple health check endpoint to confirm the service is running."""
#     return {"status": "Video Model Service is running"}

# # --- To run this server locally for testing ---
# # Use the command: uvicorn server:app --host 0.0.0.0 --port 8000 --reload
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)



# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.responses import JSONResponse
# import uvicorn
# import logging
# from predict_vitals import predict_vitals
# from fastapi.middleware.cors import CORSMiddleware # 1. ADD THIS IMPORT

# app = FastAPI(
#     title="BeatSync Video Model Service",
#     description="An API to process video files and predict vital signs.",
#     version="1.0.0"
# )

# # 2. ADD THIS ENTIRE BLOCK
# # This allows your API Gateway on Render to communicate with this service.
# # --------------------------------------------------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"], # Allows all methods
#     allow_headers=["*"], # Allows all headers
# )
# # --------------------------------------------------------------------------


# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# @app.post("/predict/")
# async def predict(video: UploadFile = File(...)):
#     if not video.filename.endswith('.mp4'):
#         raise HTTPException(status_code=400, detail="Invalid file format. Please upload an MP4 video.")
    
#     try:
#         # Save the uploaded video file temporarily
#         video_path = f"/tmp/{video.filename}"
#         with open(video_path, "wb") as buffer:
#             buffer.write(await video.read())
        
#         logger.info(f"Processing video: {video_path}")
        
#         # Get predictions
#         predictions = predict_vitals(video_path)
        
#         return JSONResponse(content=predictions)
        
#     except Exception as e:
#         logger.exception(f"An error occurred during prediction: {e}")
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/")
# def read_root():
#     return {"status": "Video Model Service is running"}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8002) # This port is for local dev only

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import logging
import requests
import os
from predict_vitals import predict_vitals
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic model for the incoming request body
class VideoRequest(BaseModel):
    video_url: str

@app.post("/predict/")
async def predict(request: VideoRequest):
    try:
        # --- Download the video from the provided URL ---
        video_url = request.video_url
        logger.info(f"Downloading video from: {video_url}")

        # Use a temporary file path
        video_path = f"/tmp/video_to_process.mp4"

        r = requests.get(video_url, stream=True)
        r.raise_for_status()
        with open(video_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

        logger.info(f"Video saved to: {video_path}")

        # --- Get predictions ---
        predictions = predict_vitals(video_path)

        # Clean up the downloaded file
        os.remove(video_path)

        return predictions

    except Exception as e:
        logger.exception(f"An error occurred during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Video Model Service is running"}