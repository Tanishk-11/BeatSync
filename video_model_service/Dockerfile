# Use a slim Python image for a smaller size
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# First, copy and install requirements to leverage Docker's layer cache
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Then, copy the rest of the application code and model files
COPY . .

# The service will run on port 8000
EXPOSE 8000

# The command to run the application
# Using --host 0.0.0.0 makes it accessible from outside the container
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
