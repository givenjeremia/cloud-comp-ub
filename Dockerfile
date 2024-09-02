FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# RUN npm run build

COPY .env.example .env

CMD ["npm", "start"] 
# CMD ["node", "./build/app.js"] 