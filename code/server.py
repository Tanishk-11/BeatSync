from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from predict_vitals import predict_vitals
import shutil
import os

app = FastAPI()

origins = [
    "http://localhost:5173" # frontend in development # your production frontend
]


# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_video/")
async def analyze_video(file: UploadFile = File(...)):
    try:
        temp_dir = "uploads"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = predict_vitals(video_path=temp_path)

        os.remove(temp_path)
        print("Video received:", temp_path)
        print("Model output:", result)


        return result

    except Exception as e:
        return {"error": str(e)}
