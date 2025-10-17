# Use a lightweight, official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer cache
COPY package*.json ./

# Install only the production dependencies to keep the image small
RUN npm install --only=production

# Copy the rest of your application's source code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# The command to start the application when the container launches
CMD ["node", "server.js"]
