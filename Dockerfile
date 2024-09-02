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

# Copy package.json and package-lock.json
COPY package*.json ./

RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the Prisma schema directory
COPY prisma ./prisma

# Generate the Prisma client
RUN npx prisma generate

# Copy the environment file
COPY .env.example .env

COPY tsconfig.json ./

# Build the application (if using TypeScript)
RUN npm run build

# Copy the rest of your application code
COPY . .



# Start the application
CMD ["npm", "start"]
