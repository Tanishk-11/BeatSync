# Stage 1: Build the React application
# Use an official Node.js image with Alpine Linux for a smaller size
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production version of the app
RUN npm run build

# Stage 2: Serve the static files with Nginx
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Copy the built static files from the build stage to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
