# FROM node:18 AS builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# COPY . .

# # RUN npm run build

# COPY .env.example .env

# CMD ["npm", "start"] 
# CMD ["node", "./build/app.js"] 
# Use a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

COPY .env.example .env

# Start the application
CMD ["npm", "start"]
