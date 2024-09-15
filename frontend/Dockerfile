# Use Node.js official image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Serve the built app using a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port React app runs on
EXPOSE 3000
