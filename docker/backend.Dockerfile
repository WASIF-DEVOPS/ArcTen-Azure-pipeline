# ============================================================
# ARCTen Backend — Multi-Stage Docker Build
# Express.js + MongoDB (Mongoose)
# ============================================================

# ── Stage 1: Install dependencies ────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching — only re-installs if these change)
COPY package.json package-lock.json ./

# ci = deterministic install from lockfile, production only = no devDependencies
RUN npm ci --only=production

# ── Stage 2: Production image ────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy only production node_modules from builder (no build tools)
COPY --from=builder /app/node_modules ./node_modules

# Copy application source code
COPY server.js ./
COPY models/ ./models/
COPY templates/ ./templates/

# Security: create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to non-root user
USER appuser

# Expose the API port
EXPOSE 5000

# Health check — Kubernetes/Docker uses this to know if app is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
