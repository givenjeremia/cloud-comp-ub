# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install


# COPY . .

# RUN npm run build



# EXPOSE 8080
# CMD ["npm", "start"]


FROM node:18

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Salin file package.json dan pnpm-lock.yaml (jika ada)
COPY package.json pnpm-lock.yaml ./

RUN rm -rf node_modules

# Install dependencies menggunakan pnpm
RUN pnpm install

# Salin semua file ke dalam kontainer
COPY . .

# Build aplikasi (gunakan pnpm untuk build)
RUN pnpm run build

COPY tsconfig.json ./

# Expose port yang digunakan aplikasi
EXPOSE 8080

# Jalankan aplikasi menggunakan pnpm
# CMD ["pnpm", "start"]
CMD ["pnpm", "run", "dev"]
