# Use an official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies for a smaller image size
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# The gateway will run on port 3000
EXPOSE 3000

# The command to start the server
CMD ["node", "server.js"]
