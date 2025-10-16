# Use a slim Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy and install requirements first
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Then, copy the application code and FAISS index
COPY . .

# The service will run on port 8001
EXPOSE 7860

# The command to run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]
