# # Use a slim Python image for a smaller size
# FROM python:3.11-slim

# # Set the working directory
# WORKDIR /app

# # First, copy and install requirements to leverage Docker's layer cache
# COPY requirements.txt requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# # Then, copy the rest of the application code and model files
# COPY . .

# # The service will run on port 8000
# EXPOSE 8000

# # The command to run the application
# # Using --host 0.0.0.0 makes it accessible from outside the container
# CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]



FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install all necessary system dependencies for dlib, opencv, and others
# libglib2.0-0 is the final missing piece required by OpenCV to run
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python requirements
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the correct port for Hugging Face Spaces
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]