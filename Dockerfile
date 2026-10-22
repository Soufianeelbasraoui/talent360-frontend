# ==========================================
# Stage 1: Build React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors first to optimize layer caching
COPY package.json package-lock.json* ./

RUN npm ci --prefer-offline || npm install

# Copy application source code and configurations
COPY . .

# Run production build
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Runtime
# ==========================================
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built static bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy tailored nginx configuration with SPA fallback & security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
