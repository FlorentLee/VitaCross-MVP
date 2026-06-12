# Dockerfile for Next.js frontend

# 1. Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# 2. Production Stage
FROM node:18-alpine

# Install tini for graceful shutdown
RUN apk add --no-cache tini

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Change ownership of the files
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Start the Next.js application with tini
CMD ["/sbin/tini", "--", "npm", "start"]
