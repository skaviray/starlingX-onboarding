# Use official Node.js v23.11 image
FROM node:23.11-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Optional: ensure dev server binds to 0.0.0.0
ENV HOST=0.0.0.0

# Expose the dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
