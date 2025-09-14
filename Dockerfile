# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist/

# Copy package.json for serve command
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
