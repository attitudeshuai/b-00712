FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start Vite
# --host 0.0.0.0 is crucial for Docker networking
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "3000"]
