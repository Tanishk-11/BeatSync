# Start from a Python 3.11 slim base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Set environment variables to force caching into a writable directory
ENV TRANSFORMERS_CACHE="/app/cache"
ENV HF_HOME="/app/cache"
ENV HUGGINGFACE_HUB_CACHE="/app/cache"

# Create the cache directory and ensure it is writable
RUN mkdir -p /app/cache && chmod 777 /app/cache

# Copy and install requirements first
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Then, copy the application code and FAISS index
COPY . .

# Expose the port the app runs on
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]