FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile
RUN bunx prisma generate

COPY . .

RUN bun run build

FROM oven/bun:alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

USER nuxt

HEALTHCHECK --interval=30s --timeout=3s --start-period=7s --retries=3 \
    CMD bun -e "fetch('http://localhost:3000').then(() => process.exit(0)).catch(() => process.exit(1))"

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run .output/server/index.mjs"]
