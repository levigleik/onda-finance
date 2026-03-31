# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1.3.11

FROM oven/bun:${BUN_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build
COPY . .
RUN bun run build

FROM oven/bun:${BUN_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -S onda \
	&& adduser -S -D -H -u 10001 -G onda onda \
	&& chown onda:onda /app

COPY --chown=onda:onda --from=build /app/dist ./dist
COPY --chown=onda:onda --from=build /app/server.ts ./server.ts

USER onda

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD bun -e "const response = await fetch('http://127.0.0.1:' + (process.env.PORT ?? '3000') + '/health'); if (!response.ok) throw new Error('unhealthy');"

CMD ["bun", "run", "server.ts"]
