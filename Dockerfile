# # FROM node:18 AS builder

# # WORKDIR /app

# # COPY package*.json ./

# # RUN npm install --legacy-peer-deps

# # COPY . .

# # # RUN npm run build

# # COPY .env.example .env

# # CMD ["npm", "start"] 
# # CMD ["node", "./build/app.js"] 
# # Use a base image
# FROM node:18

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# RUN rm -rf node_modules package-lock.json

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Copy the Prisma schema directory
# COPY prisma ./prisma
# COPY . .
# # Generate the Prisma client
# RUN npx prisma generate

# # Copy the environment file
# COPY .env.example .env

# COPY tsconfig.json ./

# # Build the application (if using TypeScript)
# RUN npm run build

# CMD ["npm", "start"]

FROM node:18

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Clean up any previous installations and install dependencies
RUN rm -rf node_modules
# RUN pnpm install --frozen-lockfile
RUN pnpm install

# Copy the Prisma schema directory
COPY prisma ./prisma

# Copy the rest of the application files
COPY . .

# Generate the Prisma client
RUN pnpm prisma generate

# Copy the environment file
COPY .env.example .env

# Copy TypeScript configuration
COPY tsconfig.json ./

# Build the application (if using TypeScript)
RUN pnpm build

# Start the application
CMD ["pnpm", "start"]
