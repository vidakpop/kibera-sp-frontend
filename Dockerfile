FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 3000

# Start dev server with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host"]