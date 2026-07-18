# ============================================================
# ARCTen Frontend — Multi-Stage Docker Build
# Next.js 14 + React 18 + Tailwind CSS
# ============================================================

# ── Stage 1: Install dependencies ────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# ── Stage 2: Build the Next.js application ───────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Build-time argument — API URL is baked into the client bundle
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js app (produces .next/ directory)
RUN npm run build

# ── Stage 3: Production runner ───────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Security: create non-root user
RUN addgroup -S nextgroup && adduser -S nextuser -G nextgroup

# Copy the standalone server + static assets from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Switch to non-root user
USER nextuser

# Expose the frontend port
EXPOSE 3000

# Set the hostname for Next.js standalone
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
